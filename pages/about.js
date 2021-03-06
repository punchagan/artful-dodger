import Head from "next/head";
import BaseLayout from "../components/layout";
import { Descriptions } from "antd";
import { pageStaticProps } from "../lib/page-utils";

export default function About({ config }) {
  return (
    <BaseLayout pageTitle={`About — ${config.title}`} siteTitle={config.title}>
      <div dangerouslySetInnerHTML={{ __html: config.aboutData }} />
    </BaseLayout>
  );
}

export const getStaticProps = pageStaticProps;
