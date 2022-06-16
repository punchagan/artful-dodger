import { useRouter } from "next/router";
import BaseLayout from "../components/layout";
import PhotoList from "../components/photo-list";
import {
  miscRooms,
  artistFilter,
  mediumFilter,
  sizeFilter,
  priceFilter,
} from "../components/room-list";
import { pageStaticProps } from "../lib/page-utils";
import { tagFilter, tagToTitle } from "../lib/tag-utils";
import { PageHeader, Breadcrumb } from "antd";

export default function Room({ config }) {
  const router = useRouter();
  const devEnv = process.env.NODE_ENV !== "production";
  const imagePrefix = devEnv && !config.forceCDN ? "" : config.imagePrefix;
  const { name, type } = router.query;
  const tagRoom = type === "misc" ? miscRooms.find((it) => it.id === name) : undefined;
  let title;
  switch (type) {
    case "misc":
      title = tagRoom?.title;
      break;

    case "tag":
      title = tagToTitle(name);
      break;

    case "size":
      title = tagToTitle(name);
      break;

    default:
      title = name;
      break;
  }
  let filter;
  switch (type) {
    case "misc":
      filter = tagRoom?.filter;
      break;

    case "tag":
      filter = tagFilter(name);
      break;

    case "artist":
      filter = artistFilter(name);
      break;

    case "medium":
      filter = mediumFilter(name);
      break;

    case "size":
      filter = sizeFilter(name);
      break;

    case "price":
      filter = priceFilter(name);
      break;
  }

  return (
    <BaseLayout siteTitle={config.title} pageTitle={`${title} — ${config.title}`}>
      <PageHeader title={title} />
      <PhotoList metadataUrl={config.metadataUrl} imagePrefix={imagePrefix} filter={filter} />
    </BaseLayout>
  );
}

export const getStaticProps = pageStaticProps;
