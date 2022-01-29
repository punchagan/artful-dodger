import { useRouter } from "next/router";
import BaseLayout from "../components/layout";
import PhotoList from "../components/photo-list";
import { extraRooms } from "../components/room-list";
import { pageStaticProps } from "../lib/page-utils";
import { tagFilter, tagToTitle } from "../lib/tag-utils";
import { PageHeader, Breadcrumb } from "antd";

export default function Room({ config }) {
  const router = useRouter();
  const { name } = router.query;
  let tagRoom = name ? extraRooms.find((it) => it.id === name) : undefined;
  let title = tagRoom ? tagRoom.title : name ? tagToTitle(name) : "";
  const devEnv = process.env.NODE_ENV !== "production";
  const imagePrefix = devEnv && !config.forceCDN ? "" : config.imagePrefix;

  let transform;
  switch (name) {
    case "all":
      transform = undefined;
      break;
    case "sold":
      transform = (arr) => arr.filter((it) => it.sold);
      break;
    default:
      transform = (array) => array.filter(tagFilter(name));
  }

  return (
    <BaseLayout siteTitle={config.title} pageTitle={`${title} — ${config.title}`}>
      <PageHeader title={title} />
      <PhotoList metadataUrl={config.metadataUrl} imagePrefix={imagePrefix} transform={transform} />
    </BaseLayout>
  );
}

export const getStaticProps = pageStaticProps;
