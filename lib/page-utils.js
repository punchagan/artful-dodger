import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

export const pageStaticProps = async () => {
  const config = {
    metadataUrl: process.env.METADATA_URL || "/metadata.json",
    imagePrefix: process.env.IMAGE_CDN_PREFIX || "",
    forceCDN: process.env.FORCE_CDN || false,
    title: process.env.TITLE,
    aboutData: await getAboutContent(),
  };
  return {
    props: {
      config,
    },
  };
};

export async function getAboutContent() {
  let fullPath = path.join("pages", "about.md");
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join("README.md");
  }
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const processedContent = await remark().use(html).process(fileContents);
  return processedContent.value;
}
