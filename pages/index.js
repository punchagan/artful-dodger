import Head from "next/head";
import BaseLayout from "../components/layout";
import PhotoList, { transformData } from "../components/photo-list";
import { useState, useEffect } from "react";

export default function Home({ config }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(config.metadataUrl)
      .then((res) => res.json())
      .then((data) => {
        const photos = data.map(transformData);
        setPhotos(photos);
        setLoading(false);
      });
  }, []);

  return (
    <BaseLayout>
      <main>
        <h1 className="title">Welcome to The Artful Dodger</h1>
        <p className="description">We consign, commission, buy and sell art.</p>
      </main>
      <PhotoList photos={photos} loading={loading} />
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
