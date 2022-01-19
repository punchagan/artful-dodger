import BaseLayout from "../components/layout";
import PhotoList from "../components/photo-list";
import { pageStaticProps } from "../lib/page-utils";

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

export const getStaticProps = pageStaticProps;
