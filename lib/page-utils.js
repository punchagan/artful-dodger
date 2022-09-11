import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

export const footerPages = [
  { title: "Return Policy", name: "return", url: "/return" },
  { title: "Privacy Policy", name: "privacy", url: "/privacy" },
  { title: "Terms & Conditions", name: "terms", url: "/terms" },
];

export const pageStaticProps = async () => {
  const config = {
    metadataUrl: process.env.METADATA_URL || "/metadata.json",
    imagePrefix: process.env.IMAGE_CDN_PREFIX || "",
    forceCDN: process.env.FORCE_CDN || false,
    title: process.env.TITLE,
    pages: footerPages.filter((page) => fs.existsSync(path.join("pages", `${page.name}.md`))),
  };
  return {
    props: {
      config,
    },
  };
};

export const getContent = async (page) => {
  let fullPath = path.join("pages", page);
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join("README.md");
  }
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const processedContent = await remark().use(html).process(fileContents);
  return processedContent.value;
};

export const makeGetStaticProps = async (name) => {
  return async () => {
    const page = `${name}.md`;
    const pageTitle = footerPages.find((it) => it.name === name)?.title || "About";
    const pageData = await getContent(page);
    const {
      props: { config },
    } = await pageStaticProps();
    return { props: { config: { ...config, pageData, pageTitle } } };
  };
};
