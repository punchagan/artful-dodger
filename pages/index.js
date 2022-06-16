import BaseLayout from "../components/layout";
import PhotoList, { usePhotos } from "../components/photo-list";
import { pageStaticProps } from "../lib/page-utils";
import { PageHeader } from "antd";

export default function Rooms({ config }) {
  const devEnv = process.env.NODE_ENV !== "production";
  const imagePrefix = devEnv && !config.forceCDN ? "" : config.imagePrefix;
  const { loading, photos } = usePhotos(config.metadataUrl, imagePrefix);
  const filter = (it) => !it.sold;
  return (
    <BaseLayout siteTitle={config.title} pageTitle={config.title}>
      <PhotoList metadataUrl={config.metadataUrl} imagePrefix={imagePrefix} filter={filter} />
    </BaseLayout>
  );
}

export const getStaticProps = pageStaticProps;
