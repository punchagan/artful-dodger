import Head from "next/head";
import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // FIXME: Make the document URL configurable
    fetch("https://opensheet.vercel.app/XXX/metadata")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data);
      });
  }, []);
  return (
    <>
      {data.map((row, idx) => (
        <div key={idx}>
          {row.title}
          <img src={`https://drive.google.com/uc?id=${row.thumbnail}&export=view`} />
          {row.description}
        </div>
      ))}
    </>
  );
}
