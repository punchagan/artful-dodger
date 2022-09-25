import { useRouter } from "next/router";
import Link from "next/link";
import BaseLayout from "../components/layout";
import PhotoList from "../components/photo-list";
import { pageStaticProps } from "../lib/page-utils";
import {
  artistFilter,
  mediumFilter,
  sizeFilter,
  priceFilter,
  tagFilter,
  toTitle,
} from "../lib/data-utils";
import { miscRooms, viewingRoomSections } from "../lib/constants";
import { Breadcrumb, Space } from "antd";

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
      title = toTitle(name);
      break;

    case "size":
      title = toTitle(name);
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
  const section = viewingRoomSections.find((v) => v.name === type);
  const sectionName = section ? section.title : toTitle(type);

  return (
    <BaseLayout siteTitle={config.title} pageTitle={`${title} — ${config.title}`}>
      <div style={{ textAlign: "center" }}>
        <Space direction="vertical">
          <Breadcrumb separator="-">
            <Breadcrumb.Item>
              <Link href={`/rooms?section=${type}`}>
                <a>{sectionName}</a>
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{title}</Breadcrumb.Item>
          </Breadcrumb>
          <p>{/* For spacing */}</p>
        </Space>
      </div>
      <PhotoList metadataUrl={config.metadataUrl} imagePrefix={imagePrefix} filter={filter} />
    </BaseLayout>
  );
}

export const getStaticProps = pageStaticProps;
