import { useRouter } from "next/router";
import BaseLayout from "../components/layout";
import { usePhotos } from "../components/photo-list";
import RoomList from "../components/room-list";
import { pageStaticProps } from "../lib/page-utils";

export default function Rooms({ config }) {
  const devEnv = process.env.NODE_ENV !== "production";
  const imagePrefix = devEnv && !config.forceCDN ? "" : config.imagePrefix;
  const router = useRouter();
  const { section } = router.query;
  const { loading, photos } = usePhotos(config.metadataUrl, imagePrefix);
  return (
    <BaseLayout siteTitle={config.title} pageTitle={config.title} pages={config.pages}>
      <RoomList photos={photos} loading={loading} section={section} />
    </BaseLayout>
  );
}

export const getStaticProps = pageStaticProps;
