import Link from "next/link";
import RoomList from "../components/room-list";
import Loading from "../components/loading";
import { tagFilter, tagToTitle } from "../lib/tag-utils";
import { Image, Row, Col, Card, Avatar, Typography, Space } from "antd";

const findFirstUnused = (photos, metadata) => {
  const previousThumbnails = new Set(metadata.map((it) => it.thumbnail));
  return photos.find((it) => !previousThumbnails.has(it.thumbnail));
};

function RoomsSection({ rooms, sectionName, photos, loading }) {
  const metadata = [];
  rooms.forEach((room, idx) => {
    const meta = findFirstUnused(photos.filter(room.filter), metadata);
    metadata.push({ ...meta, title: room.title, id: room.id });
  });

  return loading ? (
    <Loading />
  ) : (
    <div>
      <h2 style={{ textAlign: "center" }}>{sectionName}</h2>
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
    </div>
  );
}

// Miscellaneous Rooms
export const miscRooms = [
  { title: "Full Collection", id: "all", filter: (p) => p },
  { title: "Sold", id: "sold", filter: (p) => p.sold },
];

export default function Rooms({ photos, loading }) {
  // Tags/Themes rooms
  const tags = Array.from(new Set(photos.map((x) => x.tags).flat()))
    .filter((it) => Boolean(it))
    .sort();
  const tagsRooms = tags.map((tag) => ({
    title: tagToTitle(tag),
    id: tag,
    filter: tagFilter(tag),
  }));

  return loading ? (
    <Loading />
  ) : (
    <>
      <RoomsSection rooms={tagsRooms} photos={photos} sectionName="Themes" />
      <RoomsSection rooms={miscRooms} photos={photos} sectionName="Miscellaneous" />
    </>
  );
}
