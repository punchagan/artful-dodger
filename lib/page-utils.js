export const pageStaticProps = async () => {
  const config = {
    metadataUrl: "/metadata.json",
    imagePrefix: process.env.CLOUDINARY_PREFIX || "",
  };
  return {
    props: {
      config,
    },
  };
};
