import { useRouter } from "next/router";
import BaseLayout from "../components/layout";
import PhotoList from "../components/photo-list";
import { pageStaticProps } from "../lib/page-utils";
import { tagFilter, tagToTitle } from "../lib/tag-utils";
import { PageHeader } from "antd";

export default function Room({ config }) {
  const router = useRouter();
  const { name } = router.query;
  const title = name ? tagToTitle(name) : "";
  const transform = (array) => array.filter(tagFilter(name));

  return (
    <BaseLayout>
      <PageHeader title={title} backIcon={false} />
      <PhotoList metadataUrl={config.metadataUrl} transform={transform} />
    </BaseLayout>
  );
}

export const getStaticProps = pageStaticProps;
