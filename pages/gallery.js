import BaseLayout from "../components/layout";
import Entries from "../components/entries";
import { useState, useEffect } from "react";
import ReactBnbGallery from "react-bnb-gallery";
import "react-bnb-gallery/dist/style.css";
import { LoadingOutlined } from "@ant-design/icons";

export default function Gallery({ config }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const photos = data.map((p, number) => {
          const thumbnail = `https://drive.google.com/thumbnail?id=${p.thumbnail}`;
          // const photo = `https://lh3.googleusercontent.com/d/${p.thumbnail}=s1980`;
          const photo = `https://drive.google.com/uc?export=view&id=${p.thumbnail}`;
          // FIXME: Add sold status?
          const caption = `${p.title} by ${p.artist}`;
          const description = p.description || "Excellent work of art";
          const subcaption = `${description} (Price: ₹ ${p.price})`;
          return {
            ...p,
            photo,
            thumbnail,
            number,
            caption,
            subcaption,
          };
        });
        setPhotos(photos);
        setLoading(false);
      });
  }, []);

  return (
    <BaseLayout>
      {loading && <LoadingOutlined />}
      <Entries data={photos} openGalleryPhoto={openGalleryPhoto} />
      <ReactBnbGallery
        activePhotoIndex={activePhotoIndex}
        show={isOpen}
        photos={photos}
        onClose={() => setIsOpen(false)}
        wrap={false}
        opacity="0.95"
        backgroundColor="#000000"
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
