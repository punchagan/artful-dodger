import { useState, useEffect } from "react";
import Head from "next/head";
import BaseLayout from "../components/layout";
import Loading from "../components/loading";
import { Layout } from "antd";
import { makeGetStaticProps, pages } from "../lib/page-utils";
import { remark } from "remark";
import html from "remark-html";

export default function Page({ config }) {
  const { Content } = Layout;
  const { pageTitle, pages, title, name } = config;
  const [pageData, setPageData] = useState("");
  useEffect(() => {
    fetch(`${name}.md`)
      .then((res) => res.text())
      .then((data) => {
        const processedContent = remark()
          .use(html)
          .process(data)
          .then((text) => {
            setPageData(text);
          });
      });
  }, []);

  return (
    <BaseLayout pageTitle={`${pageTitle} — ${title}`} siteTitle={title} pages={pages}>
      <Content style={{ minWidth: "100%" }}>
        {pageData === "" && <Loading />}
        <div dangerouslySetInnerHTML={{ __html: pageData }} />
      </Content>
    </BaseLayout>
  );
}

export const getStaticPaths = async () => {
  const paths = pages.map((it) => `/${it.name}`);
  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => {
  const { name } = params;
  return (await makeGetStaticProps(name))();
};
