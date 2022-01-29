import BaseLayout from "../components/layout";
import { usePhotos } from "../components/photo-list";
import RoomList from "../components/room-list";
import { pageStaticProps } from "../lib/page-utils";
import { PageHeader } from "antd";

export default function Rooms({ config }) {
  const devEnv = process.env.NODE_ENV !== "production";
  const imagePrefix = devEnv && !config.forceCDN ? "" : config.imagePrefix;
  const { loading, photos } = usePhotos(config.metadataUrl, imagePrefix);
  return (
    <BaseLayout siteTitle={config.title} pageTitle={config.title}>
      <PageHeader title={config.title} />
      <RoomList photos={photos} loading={loading} />
    </BaseLayout>
  );
}

export const getStaticProps = pageStaticProps;
