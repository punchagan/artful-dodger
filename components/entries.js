export default function Entries({ data }) {
  return data.map((row, idx) => (
    <div key={idx}>
      {row.title}
      <img src={`https://drive.google.com/thumbnail?id=${row.thumbnail}`} />
      {/* <img src={`https://lh3.googleusercontent.com/d/${row.thumbnail}=s1980`} /> */}
      {row.description}
    </div>
  ));
}
