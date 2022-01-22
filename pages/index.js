import BaseLayout from "../components/layout";
import PhotoList from "../components/photo-list";
import { pageStaticProps } from "../lib/page-utils";
import { PageHeader } from "antd";

export default function Home({ config }) {
  const excludeSold = (arr) => arr.filter((it) => it.sold !== "y");
  return (
    <BaseLayout>
      <PageHeader title="The Artful Dodger" subTitle="We consign, commission, buy and sell art" />
      <PhotoList
        metadataUrl={config.metadataUrl}
        imagePrefix={config.imagePrefix}
        transform={excludeSold}
      />
    </BaseLayout>
  );
}

export const getStaticProps = pageStaticProps;
