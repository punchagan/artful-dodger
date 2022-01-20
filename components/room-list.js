import Link from "next/link";
import RoomList from "../components/room-list";
import { tagFilter, tagToTitle } from "../lib/tag-utils";
import { Image, Row, Col, Card, Avatar, Typography, Space, Spin } from "antd";

export default function Rooms({ photos, loading }) {
  const tags = Array.from(new Set(photos.map((x) => x.tags).flat())).sort();
  const metadata = tags.map((tag) => {
    const title = tagToTitle(tag);
    const tagPhotos = photos.filter(tagFilter(tag)).sort((a, b) => a.tags.length - b.tags.length);
    return tag.length > 0
      ? { ...tagPhotos[0], title, tag }
      : {
          thumbnail: `https://placehold.jp/30/777777/ffffff/300x150.png?text=${title}`,
          title,
          tag,
        };
  });

  return loading ? (
    <Spin />
  ) : (
    <Row
      justify="center"
      align="middle"
      gutter={[
        { xs: 16, sm: 24, md: 32, lg: 40, xl: 40, xxl: 40 },
        { xs: 16, sm: 24, md: 32, lg: 40, xl: 40, xxl: 40 },
      ]}
    >
      {metadata.map((photo, idx) => {
        let href = `/room/?name=${photo.tag}`;
        return (
          <Col className="gutter-row" style={{ textAlign: "center" }} key={idx} span={8}>
            <Card>
              <Link href={href}>
                <Space direction="vertical">
                  <Avatar
                    shape="square"
                    size={{ xs: 128, sm: 128, md: 256, lg: 256, xl: 256, xxl: 256 }}
                    src={photo.thumbnail}
                  />
                  <Typography.Text>{photo.title}</Typography.Text>
                </Space>
              </Link>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
