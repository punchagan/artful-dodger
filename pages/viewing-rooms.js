import BaseLayout from "../components/layout";
import { usePhotos } from "../components/photo-list";
import RoomList from "../components/room-list";
import { pageStaticProps } from "../lib/page-utils";
import { PageHeader } from "antd";

export default function Rooms({ config }) {
  const { loading, photos } = usePhotos(config.metadataUrl, config.imagePrefix);
  return (
    <BaseLayout>
      <PageHeader title="Viewing Rooms" subTitle="View curated collections of art" />
      <RoomList photos={photos} loading={loading} />
    </BaseLayout>
  );
}

export const getStaticProps = pageStaticProps;
