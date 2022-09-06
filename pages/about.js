import Head from "next/head";
import BaseLayout from "../components/layout";
import { Layout } from "antd";
import { Descriptions } from "antd";
import { pageStaticProps } from "../lib/page-utils";

export default function About({ config }) {
  const { Content } = Layout;
  return (
    <BaseLayout pageTitle={`About — ${config.title}`} siteTitle={config.title}>
      <Content>
        <div dangerouslySetInnerHTML={{ __html: config.aboutData }} />
      </Content>
    </BaseLayout>
  );
}

export const getStaticProps = pageStaticProps;
