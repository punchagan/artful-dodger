import BaseLayout from "../components/layout";
import Entries from "../components/entries";
import { useState, useEffect } from "react";

export default function List({ config }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(config.metadataUrl)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  return (
    <BaseLayout>
      <Entries data={data} />
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
