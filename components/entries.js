import { Image, Row, Col } from "antd";

export default function Entries({ data, onClick }) {
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
          <Image onClick={onClick} preview={false} src={row.photo} />
        </Col>
      ))}
    </Row>
  );
}