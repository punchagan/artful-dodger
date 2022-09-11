import Head from "next/head";
import BaseLayout from "../components/layout";
import { Layout } from "antd";
import { Descriptions } from "antd";
import { makeGetStaticProps, footerPages } from "../lib/page-utils";

export default function Page({ config }) {
  const { Content } = Layout;
  const { pageData, pageTitle, pages, title } = config;
  return (
    <BaseLayout pageTitle={`${pageTitle} — ${title}`} siteTitle={title} pages={pages}>
      <Content style={{ minWidth: "100%" }}>
        <div dangerouslySetInnerHTML={{ __html: pageData }} />
      </Content>
    </BaseLayout>
  );
}

export const getStaticPaths = async () => {
  const paths = ["/about"].concat(footerPages.map((it) => `/${it.name}`));
  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => {
  const { name } = params;
  return (await makeGetStaticProps(name))();
};
