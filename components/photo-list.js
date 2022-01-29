import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Image, Tag, Button, Switch } from "antd";
import Loading from "./loading";
import { tagToTitle } from "../lib/tag-utils";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

// Breakpoint widths taken from https://ant.design/components/layout/
const columnsCountBreakPoints = {
  576: 2, // sm
  992: 3, // lg
  1600: 4, // xxl
};

const thumbnailUrl = (id, imagePrefix) => `${imagePrefix}/image/${id}`;
const photoUrl = (id, imagePrefix) => `${imagePrefix}/image/${id}`;

const removeArtworkQueryParam = (router) => {
  const { pathname, query: oldQuery } = router;
  const { artwork, ...query } = oldQuery;
  router.push({ pathname, query });
};

const setArtworkQueryParam = (router, artwork) => {
  const { pathname, query } = router;
  const { artwork: oldArtwork, ...otherParams } = query;
  router.push({ pathname, query: { artwork, ...otherParams } });
};

const transformData = (p, number, imagePrefix) => {
  const thumbnail = p.thumbnail ? thumbnailUrl(p.thumbnail, imagePrefix) : "";
  const photo = photoUrl(p.thumbnail, imagePrefix);
  const sold = p.sold?.trim().toLowerCase() === "y";
  const price = p.sold ? `Sold` : `₹ ${p.price}`;
  const size = `${p.height} x ${p.width} cm`;
  const title = `${tagToTitle(p.title)} by ${tagToTitle(p.artist)}`;
  const tags = p.viewing_rooms
    ?.split(";")
    .map((x) => x.trim())
    .filter((it) => it !== "");
  const extraThumbnailIDs = [p.thumbnail].concat(
    p.extra_thumbnails
      .split(";")
      .map((x) => x.trim())
      .filter((it) => it !== "")
  );
  const extraThumbnails = extraThumbnailIDs.map((id) => thumbnailUrl(id, imagePrefix));
  const extraPhotos = extraThumbnailIDs.map((id) => photoUrl(id, imagePrefix));
  return {
    ...p,
    title,
    sold,
    price,
    size,
    tags,
    photo,
    thumbnail,
    extraThumbnails,
    extraPhotos,
    number,
  };
};

const filterData = (it) => {
  return Boolean(it?.thumbnail) && it?.hide_art !== "y";
};

export const usePhotos = (url, imagePrefix) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const photos = data.map((d, idx) => transformData(d, idx, imagePrefix)).filter(filterData);
        setPhotos(photos);
        setLoading(false);
      });
  }, []);

  return { loading, photos };
};

export default function PhotoList({ metadataUrl, transform, imagePrefix, random = true }) {
  const { loading, photos: data } = usePhotos(metadataUrl, imagePrefix);
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    let p = transform ? transform(data) : data;
    if (random) {
      p = p.sort(() => Math.random() - 0.5);
    }
    setPhotos(p);
  }, [data.length, random]);

  const pageSize = 15;
  const [showCount, setShowCount] = useState(pageSize);

  const [isOpen, setIsOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPhotoIndex, setZoomPhotoIndex] = useState(0);

  const activePhoto = photos[activePhotoIndex];
  const extraPhotos = activePhoto?.extraPhotos;
  const extraThumbnails = activePhoto?.extraThumbnails;
  const activeZoomPhoto = isZoomed ? extraPhotos?.[zoomPhotoIndex] : activePhoto?.photo;
  const activeThumbnail = isZoomed ? extraThumbnails?.[zoomPhotoIndex] : activePhoto?.thumbnail;

  const n = isZoomed ? extraPhotos?.length : photos.length;
  const nextIdx = isZoomed ? (zoomPhotoIndex + n + 1) % n : (activePhotoIndex + n + 1) % n;
  const nextPhoto = isZoomed ? extraPhotos?.[nextIdx] : photos[nextIdx]?.photo;
  const nextThumbnail = isZoomed ? extraThumbnails?.[nextIdx] : photos[nextIdx]?.thumbnail;
  const prevIdx = isZoomed ? (zoomPhotoIndex + n - 1) % n : (activePhotoIndex + n - 1) % n;
  const prevPhoto = isZoomed ? extraPhotos?.[prevIdx] : photos[prevIdx]?.photo;
  const prevThumbnail = isZoomed ? extraThumbnails?.[prevIdx] : photos[prevIdx]?.thumbnail;

  const enableZoomButton = extraPhotos?.length > 1;
  const photoCount = photos.length;
  const loadMore = (
    <div style={{ display: "grid", justifyContent: "center", margin: "2em" }}>
      <p>{`Showing ${Math.min(showCount, photoCount)} of ${photos.length}`}</p>
      <Button
        size="small"
        disabled={photoCount <= showCount}
        onClick={() => setShowCount(showCount + pageSize)}
      >
        Load more
      </Button>
    </div>
  );

  const countIdx = (isZoomed ? zoomPhotoIndex : activePhotoIndex) + 1;

  const router = useRouter();
  const { artwork: openedArtwork } = router.query;

  useEffect(() => {
    if (openedArtwork) {
      setIsOpen(true);
      setActivePhotoIndex(photos.findIndex((it) => it.artwork_code === openedArtwork));
    } else {
      setIsOpen(false);
    }
  }, [photos?.length, openedArtwork]);

  const openGalleryPhoto = (idx) => {
    setActivePhotoIndex(idx);
    setIsOpen(true);
    setArtworkQueryParam(router, photos[idx].artwork_code);
  };
  const onClose = () => {
    setActivePhotoIndex(0);
    setZoomPhotoIndex(0);
    setIsZoomed(false);
    setIsOpen(false);
    removeArtworkQueryParam(router);
  };
  const showPrev = () => {
    isZoomed ? setZoomPhotoIndex(prevIdx) : setActivePhotoIndex(prevIdx);
    if (!isZoomed) {
      setArtworkQueryParam(router, photos[prevIdx].artwork_code);
    }
  };
  const showNext = () => {
    isZoomed ? setZoomPhotoIndex(nextIdx) : setActivePhotoIndex(nextIdx);
    if (!isZoomed) {
      setArtworkQueryParam(router, photos[nextIdx].artwork_code);
    }
  };

  const caption = (photo) => (
    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <span>{photo?.title}</span>
        <span style={{ color: "#fffff", opacity: "0.6", fontSize: "0.9em" }}>
          {[photo?.medium, photo?.size, photo?.price].join(", ")}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          color: "#fffff",
          opacity: "0.6",
          fontSize: "0.9em",
          justifyContent: "space-between",
          textAlign: "right",
        }}
      >
        <span>{`${countIdx} of ${n}`}</span>
        {enableZoomButton ? (
          <Switch
            checkedChildren="Detailed"
            unCheckedChildren="Gallery"
            style={{ cursor: "pointer" }}
            type="primary"
            disabled={!enableZoomButton}
            checked={isZoomed}
            onClick={() => {
              setIsZoomed(!isZoomed);
              setZoomPhotoIndex(!isZoomed ? 1 : 0);
            }}
            defaultChecked={false}
          />
        ) : (
          <span />
        )}
      </div>
    </div>
  );

  return loading ? (
    <Loading />
  ) : (
    <>
      <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
        <Masonry gutter={48}>
          {photos.slice(0, showCount).map((photo, idx) => (
            <Image
              onClick={() => openGalleryPhoto(idx)}
              key={idx}
              alt={photo.title}
              preview={false}
              style={{ cursor: "pointer" }}
              src={photo.thumbnail}
              fallback={`https://placehold.jp/20/777777/ffffff/600x800?text=${photo.title}`}
            />
          ))}
        </Masonry>
      </ResponsiveMasonry>
      {loadMore}
      {isOpen && (
        <Lightbox
          onCloseRequest={onClose}
          mainSrc={activeZoomPhoto}
          nextSrc={nextPhoto}
          prevSrc={prevPhoto}
          mainSrcThumbnail={activeThumbnail}
          nextSrcThumbnail={nextThumbnail}
          prevSrcThumbnail={prevThumbnail}
          imageCaption={caption(activePhoto)}
          enableZoom={false}
          imagePadding={75}
          onMovePrevRequest={showPrev}
          onMoveNextRequest={showNext}
          animationDisabled={true}
        />
      )}
    </>
  );
}
