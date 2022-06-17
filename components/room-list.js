import Link from "next/link";
import RoomList from "../components/room-list";
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
import { miscRooms } from "../lib/constants";
import { Image, Row, Col, Card, Avatar, Typography, Space, Collapse } from "antd";

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
    <div>
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

export default function Rooms({ photos, loading }) {
  const artistRooms = makeRooms(photos, "artist", artistFilter);
  const tagRooms = makeRooms(photos, "tags", tagFilter, toTitle);
  const mediumRooms = makeRooms(photos, getMedium, mediumFilter);
  const sizeRooms = makeRooms(photos, getSize, sizeFilter, toTitle, sizeCompare);
  const priceRooms = makeRooms(photos, getPriceRange, priceFilter, undefined, priceRangeCompare);
  const sections = [
    { rooms: priceRooms, section: "price", sectionName: "Price" },
    { rooms: sizeRooms, section: "size", sectionName: "Size" },
    { rooms: mediumRooms, section: "medium", sectionName: "Medium" },
    { rooms: artistRooms, section: "artist", sectionName: "Artist" },
    { rooms: tagRooms, section: "tag", sectionName: "Theme" },
    { rooms: miscRooms, section: "misc", sectionName: "Miscellaneous" },
  ];
  const { Panel } = Collapse;
  const activeKey = sections[0].section;

  return loading ? (
    <Loading />
  ) : (
    <Collapse defaultActiveKey={activeKey} bordered={true} accordion ghost>
      {sections.map(({ section, rooms, sectionName }) => (
        <Panel header={sectionName} key={section}>
          <RoomsSection
            key={section}
            rooms={rooms}
            photos={photos}
            section={section}
            sectionName={sectionName}
          />
        </Panel>
      ))}
    </Collapse>
  );
}
