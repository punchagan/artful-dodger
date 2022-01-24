import { useState, useEffect } from "react";
import { Image, Spin, Tag, Button } from "antd";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

// Breakpoint widths taken from https://ant.design/components/layout/
const columnsCountBreakPoints = {
  576: 2, // sm
  992: 3, // lg
  1600: 4, // xxl
};

const devEnv = process.env.NODE_ENV !== "production";
const thumbnailUrl = (id, imagePrefix) =>
  devEnv ? `/thumbnail/${id}` : `${imagePrefix}/thumbnail/${id}`;
const photoUrl = (id, imagePrefix) => (devEnv ? `/image/${id}` : `${imagePrefix}/image/${id}`);

const transformData = (p, number, imagePrefix) => {
  const thumbnail = p.thumbnail ? thumbnailUrl(p.thumbnail, imagePrefix) : "";
  const photo = photoUrl(p.thumbnail, imagePrefix);
  const sold = p.sold?.trim().toLowerCase() === "y";
  const price = p.sold ? `Sold` : `₹ ${p.price}`;
  const size = `${p.height} x ${p.width} cm`;
  const title = `${p.title} by ${p.artist}`;
  const captionTags = [p.medium, size];
  if (p.sold || p.price) {
    captionTags.push(price);
  }
  const caption = captionTags.map((ct, idx) => <Tag key={idx}>{ct}</Tag>);
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
    tags,
    photo,
    thumbnail,
    extraThumbnails,
    extraPhotos,
    number,
    caption,
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

export default function PhotoList({
  metadataUrl,
  transform,
  imagePrefix,
  openedArtwork,
  closeArtworkCallback,
}) {
  const { loading, photos: data } = usePhotos(metadataUrl, imagePrefix);
  const photos = transform ? transform(data) : data;

  const [isOpen, setIsOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(
    openedArtwork ? photos?.findIndex((it) => it.artwork_code === openedArtwork) : 0
  );
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
  const zoomButton = (
    <Button
      ghost
      size="small"
      icon={isZoomed ? <ZoomOutOutlined /> : <ZoomInOutlined />}
      disabled={!enableZoomButton}
      type="primary"
      onClick={() => {
        setIsZoomed(!isZoomed);
        setZoomPhotoIndex(0);
      }}
    />
  );

  const countIdx = (isZoomed ? zoomPhotoIndex : activePhotoIndex) + 1;
  const count = <Tag>{`${countIdx} of ${n}`}</Tag>;
  const toolbarButtons = openedArtwork ? [count] : [count, zoomButton];

  useEffect(() => {
    if (openedArtwork) {
      setIsZoomed(true);
      setIsOpen(true);
      setActivePhotoIndex(photos.findIndex((it) => it.artwork_code === openedArtwork));
    }
  }, [photos, openedArtwork]);

  const openGalleryPhoto = (idx) => {
    setActivePhotoIndex(idx);
    setIsOpen(true);
  };
  const onClose = () => {
    setActivePhotoIndex(0);
    setZoomPhotoIndex(0);
    setIsZoomed(false);
    setIsOpen(false);
    if (closeArtworkCallback) {
      closeArtworkCallback();
    }
  };
  const showPrev = () => {
    isZoomed ? setZoomPhotoIndex(prevIdx) : setActivePhotoIndex(prevIdx);
  };
  const showNext = () => {
    isZoomed ? setZoomPhotoIndex(nextIdx) : setActivePhotoIndex(nextIdx);
  };

  return loading ? (
    <Spin />
  ) : (
    <>
      <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
        <Masonry gutter={16}>
          {photos.map((photo, idx) => (
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
      {isOpen && (
        <Lightbox
          onCloseRequest={onClose}
          mainSrc={activeZoomPhoto}
          nextSrc={nextPhoto}
          prevSrc={prevPhoto}
          mainSrcThumbnail={activeThumbnail}
          nextSrcThumbnail={nextThumbnail}
          prevSrcThumbnail={prevThumbnail}
          imageTitle={activePhoto?.title}
          imageCaption={activePhoto?.caption}
          enableZoom={false}
          imagePadding={50}
          toolbarButtons={toolbarButtons}
          onMovePrevRequest={showPrev}
          onMoveNextRequest={showNext}
        />
      )}
    </>
  );
}
