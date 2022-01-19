import Head from "next/head";
import BaseLayout from "../components/layout";
import PhotoList from "../components/photo-list";

export default function Home({ config }) {
  return (
    <BaseLayout>
      <main>
        <h1 className="title">Welcome to The Artful Dodger</h1>
        <p className="description">We consign, commission, buy and sell art.</p>
      </main>
      <PhotoList metadataUrl={config.metadataUrl} />
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
