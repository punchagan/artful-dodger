import { useState, useEffect } from "react";
import { Image, Spin, Tag } from "antd";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

// Breakpoint widths taken from https://ant.design/components/layout/
const columnsCountBreakPoints = {
  576: 2, // sm
  992: 3, // lg
  1600: 4, // xxl
};

const thumbnailUrl = (id) => `https://drive.google.com/thumbnail?id=${id}`;
// Alternate URL: `https://lh3.googleusercontent.com/d/${p.thumbnail}=s1980`;
const photoUrl = (id) => `https://drive.google.com/uc?export=view&id=${id}`;

const transformData = (p, number) => {
  const thumbnail = thumbnailUrl(p.thumbnail);
  const photo = photoUrl(p.thumbnail);
  const caption = `${p.title} by ${p.artist}`;
  const description = p.description || "Excellent work of art";
  const subcaption =
    p.sold === "y" ? `${description} (Sold)` : `${description} (Price: ₹ ${p.price})`;
  const tags = p.viewing_rooms.split(";").map((x) => x.trim());
  return {
    ...p,
    tags,
    photo,
    original: photo,
    thumbnail,
    number,
    caption,
    subcaption,
  };
};

export const usePhotos = (url) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const photos = data.map(transformData);
        setPhotos(photos);
        setLoading(false);
      });
  }, []);

  return { loading, photos };
};

export default function PhotoList({ metadataUrl, transform }) {
  const { loading, photos: data } = usePhotos(metadataUrl);
  const photos = transform ? transform(data) : data;

  const [isOpen, setIsOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const openGalleryPhoto = (idx) => {
    setActivePhotoIndex(idx);
    setIsOpen(true);
  };
  const n = photos.length;
  const activePhoto = photos[activePhotoIndex];
  const nextIdx = (activePhotoIndex + n + 1) % n;
  const nextPhoto = photos[nextIdx];
  const prevIdx = (activePhotoIndex + n - 1) % n;
  const prevPhoto = photos[prevIdx];
  const activeTitle = `${activePhoto?.caption} — ${activePhoto?.subcaption}`;

  const count = <Tag>{`${activePhotoIndex + 1} of ${n}`}</Tag>;
  const toolbarButtons = [count];

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
              alt={photo.caption}
              preview={false}
              src={photo.thumbnail}
            />
          ))}
        </Masonry>
      </ResponsiveMasonry>
      {isOpen && (
        <Lightbox
          onCloseRequest={() => setIsOpen(false)}
          mainSrc={activePhoto.photo}
          nextSrc={nextPhoto.photo}
          prevSrc={prevPhoto.photo}
          mainSrcThumbnail={activePhoto.thumbnail}
          nextSrcThumbnail={nextPhoto.thumbnail}
          prevSrcThumbnail={prevPhoto.thumbnail}
          imageTitle={activePhoto.caption}
          imageCaption={activePhoto.subcaption}
          enableZoom={false}
          imagePadding={50}
          toolbarButtons={toolbarButtons}
          onMovePrevRequest={() => setActivePhotoIndex(prevIdx)}
          onMoveNextRequest={() => setActivePhotoIndex(nextIdx)}
        />
      )}
    </>
  );
}
