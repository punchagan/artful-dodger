import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Image, Tag, Button, Spin, BackTop } from "antd";
import Loading from "./loading";
import Lightbox from "./lightbox";
import { getMedium, getSize, getPriceRange, toTitle } from "../lib/data-utils";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { columnsCountBreakPoints } from "../lib/constants";
import InfiniteScroll from "react-infinite-scroll-component";
import { Slider } from "./slider";

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
  const sold = p.status?.trim().toLowerCase() === "s";
  const archived = p.status?.trim().toLowerCase() === "ar";
  const displayPrice = sold ? "Sold" : archived ? "Archived" : `₹ ${p.price}`;
  const size = `${p.height} x ${p.width} cm`;
  const name = toTitle(p.title);
  const artistName = toTitle(p.artist);
  const title = `${name} by ${artistName}`;
  const tags = p.viewing_rooms
    ?.split(";")
    .map((x) => x.trim())
    .filter((it) => it !== "");
  const extraThumbnailIDs = [p.thumbnail].concat(
    p.extra_thumbnails
      ?.split(";")
      ?.map((x) => x.trim())
      ?.filter((it) => it !== "")
  );
  const extraThumbnails = extraThumbnailIDs.map((id) => thumbnailUrl(id, imagePrefix));
  const extraPhotos = extraThumbnailIDs.map((id) => photoUrl(id, imagePrefix));
  return {
    ...p,
    name,
    artistName,
    title,
    sold,
    archived,
    displayPrice,
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

export default function PhotoList({ metadataUrl, filter, imagePrefix, random = true }) {
  const { loading, photos: data } = usePhotos(metadataUrl, imagePrefix);
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    let p = filter ? data.filter(filter) : data;
    if (random) {
      p = p.sort(() => Math.random() - 0.5);
    }
    setPhotos(p);
  }, [data.length, random]);

  const pageSize = 30;
  const [showCount, setShowCount] = useState(pageSize);

  const [isOpen, setIsOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState();
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPhotoIndex, setZoomPhotoIndex] = useState(0);

  const [activePhoto, setActivePhoto] = useState();
  const [nextPhoto, setNextPhoto] = useState();
  const [prevPhoto, setPrevPhoto] = useState();

  const [activeThumbnail, setActiveThumbnail] = useState();
  const [nextThumbnail, setNextThumbnail] = useState();
  const [prevThumbnail, setPrevThumbnail] = useState();

  const enableZoomButton = activePhoto?.extraPhotos?.length > 1;
  const photoCount = photos.length;
  const allLoaded = photoCount <= showCount;
  const fetchMore = () => setShowCount(showCount + pageSize);
  const countDisplay = (
    <div style={{ display: "grid", justifyContent: "center", margin: "2em" }}>
      <p>{`Showing ${Math.min(showCount, photoCount)} of ${photos.length}`}</p>
    </div>
  );

  const n = photos?.length;
  const router = useRouter();
  const { artwork: openedArtwork } = router.query;

  useEffect(() => {
    if (openedArtwork) {
      setIsOpen(true);
      setActivePhotoIndex(photos.findIndex((it) => it.artwork_code === openedArtwork));
    } else {
      setIsOpen(false);
    }
    if (scrollPosition) {
      window.scrollTo(0, scrollPosition);
    }
  }, [photos?.length, openedArtwork]);

  useEffect(() => {
    const photo = photos?.[activePhotoIndex];
    const extraPhotos = photo?.extraPhotos;
    const extraThumbnails = photo?.extraThumbnails;
    const photoURL = extraPhotos?.[zoomPhotoIndex];
    const thumbURL = extraThumbnails?.[zoomPhotoIndex];
    const photoObj = { ...photo, photo: photoURL, thumbnail: thumbURL };
    setActivePhoto(photoObj);
    setActiveThumbnail(photoObj?.thumbnail);

    const idx = isZoomed ? zoomPhotoIndex : activePhotoIndex;
    const m = isZoomed ? extraPhotos?.length : n;

    const nextIdx = (idx + m + 1) % m;
    const nextPhoto = isZoomed
      ? { ...photo, photo: extraPhotos?.[nextIdx], thumbnail: extraThumbnails?.[nextIdx] }
      : photos[nextIdx];
    setNextPhoto(nextPhoto?.photo);
    setNextThumbnail(nextPhoto?.thumbnail);

    const prevIdx = (idx + m - 1) % m;
    const prevPhoto = isZoomed
      ? { ...photo, photo: extraPhotos?.[prevIdx], thumbnail: extraThumbnails?.[prevIdx] }
      : photos[prevIdx];
    setPrevPhoto(prevPhoto?.photo);
    setPrevThumbnail(prevPhoto?.thumbnail);
  }, [activePhotoIndex, zoomPhotoIndex, isZoomed, photos?.length, openedArtwork]);

  const openGalleryPhoto = (idx) => {
    setScrollPosition(window.pageYOffset);
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
  const showPrev = (ev) => {
    const scrollZoomed = ev?.type === "scroll" && ev?.direction === "x";
    setIsZoomed(scrollZoomed);

    const m = activePhoto?.extraPhotos?.length;
    const idx = scrollZoomed ? (zoomPhotoIndex + m - 1) % m : (activePhotoIndex + n - 1) % n;
    if (!scrollZoomed) {
      setZoomPhotoIndex(0);
      setArtworkQueryParam(router, photos[idx].artwork_code);
    } else {
      setZoomPhotoIndex(idx);
    }
  };
  const showNext = (ev) => {
    const scrollZoomed = ev?.type === "scroll" && ev?.direction === "x";
    setIsZoomed(scrollZoomed);

    const m = activePhoto?.extraPhotos?.length;
    const idx = scrollZoomed ? (zoomPhotoIndex + m + 1) % m : (activePhotoIndex + n + 1) % n;
    if (!scrollZoomed) {
      setZoomPhotoIndex(0);
      setArtworkQueryParam(router, photos[idx].artwork_code);
    } else {
      setZoomPhotoIndex(idx);
    }
  };

  const linkStyle = {
    color: "#fff",
    paddingRight: "5px",
    marginRight: "5px",
  };
  const caption = (photo) => {
    const m = photo?.extraPhotos?.length;
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "0 0 1em 0",
          }}
        >
          <Slider
            size="normal"
            length={m}
            clickable={true}
            index={zoomPhotoIndex}
            onClick={(num) => {
              setZoomPhotoIndex(num);
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="caption-left"
          >
            <span>
              {`${photo?.name} by `}
              <a style={{ color: "#fff" }} href={`/room?name=${photo?.artistName}&type=artist`}>
                {photo?.artistName}
              </a>
            </span>
            <span style={{ opacity: "0.6", fontSize: "0.9em" }}>
              <a style={linkStyle} href={`/room?name=${getMedium(photo)}&type=medium`}>
                {`${photo?.medium}.`}
              </a>
              <a style={linkStyle} href={`/room?name=${getSize(photo)}&type=size`}>
                {`${photo?.size}.`}
              </a>
              <a
                style={linkStyle}
                href={
                  photo?.sold
                    ? `/room?name=sold&type=misc`
                    : `/room?name=${getPriceRange(photo)}&type=price`
                }
              >
                {photo?.displayPrice}
              </a>
            </span>
          </div>
        </div>
      </div>
    );
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      <BackTop />
      <InfiniteScroll
        dataLength={showCount}
        next={fetchMore}
        hasMore={!allLoaded}
        loader={
          <div style={{ textAlign: "center" }}>
            <Spin />
          </div>
        }
      >
        <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
          <Masonry gutter={"1px"}>
            {photos.slice(0, showCount).map((photo, idx) => (
              <div key={idx} className="img-wrapper">
                <Image
                  onClick={() => openGalleryPhoto(idx)}
                  alt={photo.title}
                  preview={false}
                  style={{ cursor: "pointer" }}
                  src={photo.thumbnail}
                  fallback={`https://placehold.jp/20/777777/ffffff/600x800?text=${photo.title}`}
                />
                <div className="caption-container">
                  <div className="caption-text">
                    {`${photo?.name} by ${photo?.artistName}. ${photo?.medium}. ${photo?.size}. ${photo?.displayPrice}`}
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </InfiniteScroll>
      {allLoaded && countDisplay}
      {isOpen && (
        <Lightbox
          onCloseRequest={onClose}
          mainSrc={activePhoto?.photo}
          nextSrc={nextPhoto}
          prevSrc={prevPhoto}
          mainSrcThumbnail={activeThumbnail}
          nextSrcThumbnail={nextThumbnail}
          prevSrcThumbnail={prevThumbnail}
          imageCaption={caption(activePhoto)}
          enableZoom={true}
          yImagePadding={96}
          xImagePadding={0}
          onMovePrevRequest={showPrev}
          onMoveNextRequest={showNext}
          animationDisabled={true}
        />
      )}
    </>
  );
}
