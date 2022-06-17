import Link from "next/link";
import Loading from "../components/loading";
import {
  artistFilter,
  priceFilter,
  mediumFilter,
  sizeFilter,
  tagFilter,
  toTitle,
  getMedium,
  getSize,
  getPriceRange,
  sizeCompare,
  priceRangeCompare,
} from "../lib/data-utils";
import { miscRooms, viewingRoomSections } from "../lib/constants";
import { Image, Row, Col, Card, Avatar, Typography, Space, PageHeader } from "antd";

function RoomsSection({ rooms, section, sectionName, photos, loading }) {
  const metadata = [];
  const findFirstUnused = (photos, metadata) => {
    const previousThumbnails = new Set(metadata.map((it) => it.thumbnail));
    return photos.find((it) => !previousThumbnails.has(it.thumbnail));
  };

  rooms.forEach((room, idx) => {
    const meta = findFirstUnused(photos.filter(room.filter), metadata);
    metadata.push({ ...meta, title: room.title, id: room.id });
  });

  return loading ? (
    <Loading />
  ) : (
    <>
      <PageHeader title={`${sectionName}`} />
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
    </>
  );
}

const makeRooms = (photos, attribute, filter, toTitle, compareFn) => {
  const ids = Array.from(
    new Set(
      photos.map((x) => (typeof attribute === "function" ? attribute(x) : x[attribute])).flat()
    )
  )
    .filter((it) => Boolean(it))
    .sort(compareFn);
  return ids.map((id) => ({
    title: toTitle ? toTitle(id) : id,
    id: id,
    filter: filter(id),
  }));
};

export default function RoomList({ photos, loading, section = "artist" }) {
  const section_ = viewingRoomSections.find((v) => v.name === section);
  let sectionName = section_ ? section_.title : toTitle(section);
  let rooms = [];
  switch (section) {
    case "price":
      rooms = makeRooms(photos, getPriceRange, priceFilter, undefined, priceRangeCompare);
      break;

    case "size":
      rooms = makeRooms(photos, getSize, sizeFilter, toTitle, sizeCompare);
      break;

    case "medium":
      rooms = makeRooms(photos, getMedium, mediumFilter);
      break;

    case "tag":
      rooms = makeRooms(photos, "tags", tagFilter, toTitle);
      break;

    case "artist":
      rooms = makeRooms(photos, "artist", artistFilter);
      break;

    case "misc":
      rooms = miscRooms;
      break;
  }

  return loading ? (
    <Loading />
  ) : (
    <RoomsSection
      key={section}
      rooms={rooms}
      photos={photos}
      section={section}
      sectionName={sectionName}
    />
  );
}
