import Head from "next/head";
import BaseLayout from "../components/layout";
import { Layout } from "antd";
import { Descriptions } from "antd";
import { makeGetStaticProps } from "../lib/page-utils";

export default function About({ config }) {
  const { Content } = Layout;
  return (
    <BaseLayout pageTitle={`About — ${config.title}`} siteTitle={config.title}>
      <Content style={{ minWidth: "100%" }}>
        <div dangerouslySetInnerHTML={{ __html: config.pageData }} />
      </Content>
    </BaseLayout>
  );
}

export const getStaticProps = async () => {
  return (await makeGetStaticProps("about.md"))();
};
