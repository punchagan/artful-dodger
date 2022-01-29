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
    aboutDescription: process.env.ABOUT_DESCRIPTION || "",
  };
  return {
    props: {
      config,
    },
  };
};

export async function getAboutContent() {
  const fullPath = path.join(process.env.ABOUT_MD_FILE);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const processedContent = await remark().use(html).process(fileContents);
  return processedContent.value;
}
