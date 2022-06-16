import Link from "next/link";
import RoomList from "../components/room-list";
import Loading from "../components/loading";
import { tagFilter, tagToTitle } from "../lib/tag-utils";
import { Image, Row, Col, Card, Avatar, Typography, Space } from "antd";

const findFirstUnused = (photos, metadata) => {
  const previousThumbnails = new Set(metadata.map((it) => it.thumbnail));
  return photos.find((it) => !previousThumbnails.has(it.thumbnail));
};

function RoomsSection({ rooms, section, sectionName, photos, loading }) {
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
          let href = `/room/?name=${room.id}&type=${section}`;
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

export const artistFilter = (artist) => (p) => p.artist === artist;

const makeRooms = (photos, attribute, filter, toTitle) => {
  const ids = Array.from(new Set(photos.map((x) => x[attribute]).flat()))
    .filter((it) => Boolean(it))
    .sort();
  return ids.map((id) => ({
    title: toTitle ? toTitle(id) : id,
    id: id,
    filter: filter(id),
  }));
};

export default function Rooms({ photos, loading }) {
  const artistRooms = makeRooms(photos, "artist", artistFilter);
  const tagRooms = makeRooms(photos, "tags", tagFilter, tagToTitle);
  return loading ? (
    <Loading />
  ) : (
    <>
      <RoomsSection rooms={artistRooms} photos={photos} section="artist" sectionName="Artist" />
      <RoomsSection rooms={tagRooms} photos={photos} section="tag" sectionName="Themes" />
      <RoomsSection rooms={miscRooms} photos={photos} section="misc" sectionName="Miscellaneous" />
    </>
  );
}
