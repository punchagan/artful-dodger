import { Image, Row, Col } from "antd";

export default function Entries({ data }) {
  return (
    <Row
      justify="center"
      align="middle"
      gutter={[
        { xs: 16, sm: 24, md: 32, lg: 40 },
        { xs: 16, sm: 24, md: 32, lg: 40 },
      ]}
    >
      {data.map((row, idx) => (
        <Col className="gutter-row" key={idx} span={8}>
          <Image preview={false} src={`https://drive.google.com/thumbnail?id=${row.thumbnail}`} />
          {/* <img src={`https://lh3.googleusercontent.com/d/${row.thumbnail}=s1980`} /> */}
        </Col>
      ))}
    </Row>
  );
}
