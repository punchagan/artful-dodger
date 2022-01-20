import { useRouter } from "next/router";
import BaseLayout from "../components/layout";
import PhotoList from "../components/photo-list";
import { extraRooms } from "../components/room-list";
import { pageStaticProps } from "../lib/page-utils";
import { tagFilter, tagToTitle } from "../lib/tag-utils";
import { PageHeader } from "antd";

export default function Room({ config }) {
  const router = useRouter();
  const { name } = router.query;
  let tagRoom = name ? extraRooms.find((it) => it.tag === name) : undefined;
  let title = tagRoom ? tagRoom.title : name ? tagToTitle(name) : "";

  let transform;
  switch (name) {
    case "all":
      transform = (x) => x;
      break;
    case "sold":
      transform = (arr) => arr.filter((it) => it.sold === "y");
      break;
    default:
      transform = (array) => array.filter(tagFilter(name));
  }

  return (
    <BaseLayout>
      <PageHeader title={title} backIcon={false} />
      <PhotoList metadataUrl={config.metadataUrl} transform={transform} />
    </BaseLayout>
  );
}

export const getStaticProps = pageStaticProps;
