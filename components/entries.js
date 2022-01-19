import { Image, Row, Col } from "antd";

export default function Entries({ data, openGalleryPhoto }) {
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
        <Col className="gutter-row" style={{ textAlign: "center" }} key={idx} span={8}>
          <Image
            onClick={() => openGalleryPhoto(idx)}
            alt={row.caption}
            preview={false}
            src={row.thumbnail}
          />
        </Col>
      ))}
    </Row>
  );
}
