export const pageStaticProps = async () => {
  const config = {
    metadataUrl: process.env.METADATA_URL || "",
    imagePrefix: process.env.CLOUDINARY_PREFIX || "",
  };
  return {
    props: {
      config,
    },
  };
};
