import BaseLayout from "../components/layout";
import Entries from "../components/entries";
import { useState, useEffect } from "react";
import ReactBnbGallery from "react-bnb-gallery";
import "react-bnb-gallery/dist/style.css";

export default function Gallery({ config }) {
  const [photos, setPhotos] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const openGalleryPhoto = (idx) => {
    setActivePhotoIndex(idx);
    setIsOpen(true);
  };

  useEffect(() => {
    fetch(config.metadataUrl)
      .then((res) => res.json())
      .then((data) => {
        const photos = data.map((p, idx) => {
          const photo = `https://drive.google.com/thumbnail?id=${p.thumbnail}`;
          // const photo = `https://lh3.googleusercontent.com/d/${p.thumbnail}=s1980`
          // FIXME: Add sold status?
          const caption = `${p.title} by ${p.artist}`;
          // FIXME: Add real description/price? Sold status?
          const description = p.description || "Excellent work of art";
          const subcaption = `${description} (Price: ₹ ${p.price})`;
          return {
            ...p,
            photo,
            thumbnail: photo,
            number: idx,
            caption,
            subcaption,
          };
        });
        setPhotos(photos);
      });
  }, []);

  return (
    <BaseLayout>
      <Entries data={photos} openGalleryPhoto={openGalleryPhoto} />
      <ReactBnbGallery
        activePhotoIndex={activePhotoIndex}
        show={isOpen}
        photos={photos}
        onClose={() => setIsOpen(false)}
        wrap={false}
        opacity="0.98"
        backgroundColor="#888888"
      />
    </BaseLayout>
  );
}

export async function getStaticProps() {
  const config = {
    metadataUrl: process.env.METADATA_URL || "",
  };
  return {
    props: {
      config,
    },
  };
}
