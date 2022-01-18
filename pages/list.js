import BaseLayout from "../components/layout";
import { useState, useEffect } from "react";

const Entries = ({ metadataUrl }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(metadataUrl)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  return data.map((row, idx) => (
    <div key={idx}>
      {row.title}
      <img src={`https://drive.google.com/thumbnail?id=${row.thumbnail}`} />
      {/* <img src={`https://lh3.googleusercontent.com/d/${row.thumbnail}=s1980`} /> */}
      {row.description}
    </div>
  ));
};

export default function List({ config }) {
  return (
    <BaseLayout>
      <Entries metadataUrl={config.metadataUrl} />
    </BaseLayout>
  );
}

export async function getStaticProps() {
  const config = {
    metadataUrl: process.env.METADATA_URL || "",
  };
  return {
    props: {
      config,
    },
  };
}
