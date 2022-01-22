import BaseLayout from "../components/layout";
import PhotoList from "../components/photo-list";
import { pageStaticProps } from "../lib/page-utils";
import { PageHeader } from "antd";

export default function Home({ config }) {
  return (
    <BaseLayout>
      <PageHeader title="The Artful Dodger" subTitle="We consign, commission, buy and sell art" />
      <PhotoList metadataUrl={config.metadataUrl} imagePrefix={config.imagePrefix} />
    </BaseLayout>
  );
}

export const getStaticProps = pageStaticProps;
