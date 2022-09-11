import Head from "next/head";
import BaseLayout from "../components/layout";
import { Layout } from "antd";
import { Descriptions } from "antd";
import { pageStaticProps, getAboutContent } from "../lib/page-utils";

export default function About({ config }) {
  const { Content } = Layout;
  return (
    <BaseLayout pageTitle={`About — ${config.title}`} siteTitle={config.title}>
      <Content style={{ minWidth: "100%" }}>
        <div dangerouslySetInnerHTML={{ __html: config.aboutData }} />
      </Content>
    </BaseLayout>
  );
}

export const getStaticProps = async () => {
  const aboutData = await getAboutContent();
  const {
    props: { config },
  } = await pageStaticProps();
  return { props: { config: { ...config, aboutData } } };
};
