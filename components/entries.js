import { Row, Col } from "antd";

export default function Entries({ data }) {
  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      {data.map((row, idx) => (
        <Col className="gutter-row" key={idx} span={4}>
          <div>
            <img src={`https://drive.google.com/thumbnail?id=${row.thumbnail}`} />
            {/* <img src={`https://lh3.googleusercontent.com/d/${row.thumbnail}=s1980`} /> */}
          </div>
        </Col>
      ))}
    </Row>
  );
}
