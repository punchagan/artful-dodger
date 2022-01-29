export const pageStaticProps = async () => {
  const config = {
    metadataUrl: "/metadata.json",
    imagePrefix: process.env.CLOUDINARY_PREFIX || "",
    title: process.env.TITLE,
  };
  return {
    props: {
      config,
    },
  };
};
