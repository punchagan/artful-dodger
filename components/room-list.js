import Link from "next/link";
import RoomList from "../components/room-list";
import Loading from "../components/loading";
import { tagFilter, tagToTitle } from "../lib/tag-utils";
import { Image, Row, Col, Card, Avatar, Typography, Space } from "antd";

const findFirstUnused = (photos, metadata) => {
  const previousThumbnails = new Set(metadata.map((it) => it.thumbnail));
  return photos.find((it) => !previousThumbnails.has(it.thumbnail));
};

export const extraRooms = [
  { title: "Full Collection", id: "all" },
  { title: "Sold", id: "sold" },
];
export default function Rooms({ photos, loading }) {
  const tags = Array.from(new Set(photos.map((x) => x.tags).flat()))
    .filter((it) => Boolean(it))
    .sort();
  const tagRooms = tags.map((tag) => ({ title: tagToTitle(tag), id: tag }));
  const rooms = extraRooms.slice(0, 1).concat(tagRooms).concat(extraRooms.slice(1));
  const metadata = [];

  let meta;
  rooms.forEach((room, idx) => {
    switch (room.id) {
      case "all":
        meta = findFirstUnused(photos, metadata);
        break;

      case "sold":
        meta = findFirstUnused(
          photos.filter((p) => p.sold),
          metadata
        );
        break;

      default:
        meta = findFirstUnused(photos.filter(tagFilter(room.id)), metadata);
        break;
    }
    metadata.push({ ...meta, title: room.title, id: room.id });
  });

  return loading ? (
    <Loading />
  ) : (
    <Row justify="center" align="middle" gutter={[16, 16]}>
      {metadata.map((room, idx) => {
        let href = `/room/?name=${room.id}`;
        return (
          <Col
            className="gutter-row"
            style={{ textAlign: "center" }}
            key={idx}
            span={{ xs: 12, sm: 12, md: 12, lg: 8, xl: 8, xxl: 8 }}
          >
            <Card bordered={false} hoverable={false}>
              <Link href={href}>
                <Space direction="vertical">
                  <Avatar
                    style={{ cursor: "pointer" }}
                    shape="square"
                    size={{ xs: 96, sm: 128, md: 128, lg: 256, xl: 256, xxl: 256 }}
                    src={room.thumbnail}
                  />
                  <Typography.Text style={{ cursor: "pointer" }}>{room.title}</Typography.Text>
                </Space>
              </Link>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
