import Link from "next/link";
import RoomList from "../components/room-list";
import { tagFilter, tagToTitle } from "../lib/tag-utils";
import { Image, Row, Col, Card, Avatar, Typography, Space, Spin } from "antd";

const findFirstMissing = (photos, metadata) => {
  const previousThumbnails = new Set(metadata.map((it) => it.thumbnail));
  return photos.find((it) => !previousThumbnails.has(it.thumbnail));
};

export const extraRooms = [
  { title: "Entire Collection", tag: "all" },
  { title: "Sold", tag: "sold" },
];
export default function Rooms({ photos, loading }) {
  const tags = Array.from(new Set(photos.map((x) => x.tags).flat())).sort();
  const tagRooms = tags.map((tag) => ({ title: tagToTitle(tag), tag }));
  const rooms = tagRooms.concat(extraRooms);
  const metadata = [];

  let meta;
  rooms.forEach((room, idx) => {
    switch (room.tag) {
      case "all":
        meta = findFirstMissing(photos, metadata);
        break;

      case "sold":
        meta = findFirstMissing(
          photos.filter((p) => p.sold === "y"),
          metadata
        );
        break;

      default:
        meta = findFirstMissing(photos.filter(tagFilter(room.tag)), metadata);
        break;
    }
    metadata.push({ ...meta, title: room.title, tag: room.tag });
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
