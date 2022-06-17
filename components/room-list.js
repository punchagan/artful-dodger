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
const mediumTransform = (medium) => medium?.split(" on ")[0];
export const mediumFilter = (medium) => (p) => mediumTransform(p.medium) === medium;

const sizes = ["small", "medium", "large"];
export const sizeFilter = (size) => (p) => {
  const area = p.height * p.width;
  const smallArea = 900; // 30 * 30;
  const mediumArea = 2700; //60 * 45;

  let sizeMatch = false;
  switch (size) {
    case "small":
      sizeMatch = area < smallArea;
      break;

    case "medium":
      sizeMatch = smallArea <= area && area < mediumArea;
      break;

    case "large":
      sizeMatch = mediumArea <= area;
      break;
  }
  return sizeMatch;
};

const prices = ["< ₹ 8,000", "₹ 8,000 — ₹ 16,000", "> ₹ 16,000"];
export const priceFilter = (priceRange) => (p) => {
  const price = p.price;
  let priceMatch = false;
  switch (priceRange) {
    case prices[0]:
      priceMatch = price < 8_000;
      break;

    case prices[1]:
      priceMatch = 8_000 <= price && price < 16_000;
      break;

    case prices[2]:
      priceMatch = 16_000 <= price;
      break;
  }
  return priceMatch;
};

const makeRooms = (photos, attribute, filter, toTitle, attrTransform) => {
  const ids = Array.from(
    new Set(
      photos
        .map((x) => {
          const attrValue = x[attribute];
          return attrTransform ? attrTransform(attrValue) : attrValue;
        })
        .flat()
    )
  )
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
  const mediumRooms = makeRooms(photos, "medium", mediumFilter, undefined, mediumTransform);
  const sizeRooms = sizes.map((size) => ({
    id: size,
    title: tagToTitle(size),
    filter: sizeFilter(size),
  }));
  const priceRooms = prices.map((price) => ({
    id: price,
    title: price,
    filter: priceFilter(price),
  }));
  const sections = [
    { rooms: priceRooms, section: "price", sectionName: "Price" },
    { rooms: sizeRooms, section: "size", sectionName: "Size" },
    { rooms: mediumRooms, section: "medium", sectionName: "Medium" },
    { rooms: artistRooms, section: "artist", sectionName: "Artist" },
    { rooms: tagRooms, section: "tag", sectionName: "Theme" },
    { rooms: miscRooms, section: "misc", sectionName: "Miscellaneous" },
  ];

  return loading ? (
    <Loading />
  ) : (
    sections.map(({ section, rooms, sectionName }) => (
      <RoomsSection
        key={section}
        rooms={rooms}
        photos={photos}
        section={section}
        sectionName={sectionName}
      />
    ))
  );
}
