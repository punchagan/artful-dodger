import { pages } from "./constants";

export const pageStaticProps = async () => {
  const config = {
    metadataUrl: process.env.METADATA_URL || "/metadata.json",
    imagePrefix: process.env.IMAGE_CDN_PREFIX || "",
    forceCDN: process.env.FORCE_CDN || false,
    title: process.env.TITLE,
    pages: pages.filter((it) => it.name !== "about"),
  };
  return {
    props: {
      config,
    },
  };
};

export const makeGetStaticProps = async (name) => {
  return async () => {
    const page = `${name}.md`;
    const pageTitle = pages.find((it) => it.name === name)?.title;
    const {
      props: { config },
    } = await pageStaticProps();
    return { props: { config: { ...config, pageTitle, name } } };
  };
};
