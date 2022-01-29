export const pageStaticProps = async () => {
  const config = {
    metadataUrl: "/metadata.json",
    imagePrefix: process.env.IMAGE_CDN_PREFIX || "",
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
