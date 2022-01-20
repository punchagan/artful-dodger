import { useState, useEffect } from "react";
import { Image, Spin } from "antd";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import ReactBnbGallery from "react-bnb-gallery";
import "react-bnb-gallery/dist/style.css";

// Breakpoint widths taken from https://ant.design/components/layout/
const columnsCountBreakPoints = {
  576: 2, // sm
  992: 3, // lg
  1600: 4, // xxl
};

const transformData = (p, number) => {
  const thumbnail = `https://drive.google.com/thumbnail?id=${p.thumbnail}`;
  // const photo = `https://lh3.googleusercontent.com/d/${p.thumbnail}=s1980`;
  const photo = `https://drive.google.com/uc?export=view&id=${p.thumbnail}`;
  // FIXME: Add sold status?
  const caption = `${p.title} by ${p.artist}`;
  const description = p.description || "Excellent work of art";
  const subcaption = `${description} (Price: ₹ ${p.price})`;
  const tags = p.viewing_rooms.split(";").map((x) => x.trim());
  return {
    ...p,
    tags,
    photo,
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
      <ReactBnbGallery
        activePhotoIndex={activePhotoIndex}
        show={isOpen}
        photos={photos}
        onClose={() => setIsOpen(false)}
        wrap={false}
        opacity="0.95"
        backgroundColor="#000000"
      />
    </>
  );
}
