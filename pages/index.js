import BaseLayout from "../components/layout";
import PhotoList, { usePhotos } from "../components/photo-list";
import { pageStaticProps } from "../lib/page-utils";

export default function Rooms({ config }) {
  const devEnv = process.env.NODE_ENV !== "production";
  const imagePrefix = devEnv && !config.forceCDN ? "" : config.imagePrefix;
  const { loading, photos } = usePhotos(config.metadataUrl, imagePrefix);
  return (
    <BaseLayout siteTitle={config.title} pageTitle={config.title} pages={config.pages}>
      <PhotoList metadataUrl={config.metadataUrl} imagePrefix={imagePrefix} />
    </BaseLayout>
  );
}

export const getStaticProps = pageStaticProps;
