import { useState, useEffect } from "react";
import Head from "next/head";
import BaseLayout from "../components/layout";
import Loading from "../components/loading";
import { Layout } from "antd";
import { InstagramOutlined, MailOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { makeGetStaticProps } from "../lib/page-utils";
import { pages } from "../lib/constants";
import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import ReactDOMServer from "react-dom/server";

export default function Page({ config }) {
  const { Content } = Layout;
  const { pageTitle, pages, title, name } = config;
  const [pageData, setPageData] = useState("");
  useEffect(() => {
    fetch(`${name}.md`)
      .then((res) => res.text())
      .then((data) => {
        const processedContent = remark()
          .use(remarkParse)
          .use(remarkRehype, { allowDangerousHtml: true })
          .use(rehypeStringify, { allowDangerousHtml: true })
          .process(data)
          .then((data) => {
            const whatsAppIcon = ReactDOMServer.renderToString(<WhatsAppOutlined />);
            const mailIcon = ReactDOMServer.renderToString(<MailOutlined />);
            const instagramIcon = ReactDOMServer.renderToString(<InstagramOutlined />);
            let text = data?.value
              ?.replace("<WhatsAppOutlined />", whatsAppIcon)
              .replace("<MailOutlined />", mailIcon)
              .replace("<InstagramOutlined />", instagramIcon);
            setPageData(text);
          });
      });
  });

  return (
    <BaseLayout pageTitle={`${pageTitle} — ${title}`} siteTitle={title} pages={pages}>
      <Content style={{ minWidth: "100%" }}>
        {pageData === "" && <Loading />}
        <div className="markdown-data" dangerouslySetInnerHTML={{ __html: pageData }} />
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
