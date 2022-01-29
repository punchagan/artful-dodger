export const pageStaticProps = async () => {
  const config = {
    metadataUrl: process.env.METADATA_URL || "/metadata.json",
    imagePrefix: process.env.IMAGE_CDN_PREFIX || "",
    forceCDN: process.env.FORCE_CDN || false,
    title: process.env.TITLE,
    email: process.env.CONTACT_EMAIL,
    phone: process.env.CONTACT_PHONE,
  };
  return {
    props: {
      config,
    },
  };
};
