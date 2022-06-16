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

  let filter;
  switch (name) {
    case "all":
      filter = (it) => it;
      break;
    case "sold":
      filter = (it) => it.sold;
      break;
    default:
      filter = tagFilter(name);
  }

  return (
    <BaseLayout siteTitle={config.title} pageTitle={`${title} — ${config.title}`}>
      <PageHeader title={title} />
      <PhotoList metadataUrl={config.metadataUrl} imagePrefix={imagePrefix} filter={filter} />
    </BaseLayout>
  );
}

export const getStaticProps = pageStaticProps;
