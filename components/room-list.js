import { useState, useEffect } from "react";
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
import { miscRooms, viewingRoomSections, roomsColumnsCountBreakPoints } from "../lib/constants";
import { Avatar, Typography, Space, Breadcrumb } from "antd";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const getAvatarSize = (n, gap) => {
  const w = window.innerWidth;
  const gapAll = gap * (n + 1);
  return (w - gapAll) / n;
};

function RoomsSection({ rooms, section, sectionName, photos, loading }) {
  const metadata = [];
  const findFirstUnused = (photos, metadata) => {
    const previousThumbnails = new Set(metadata.map((it) => it.thumbnail));
    return photos.find((it) => !previousThumbnails.has(it.thumbnail));
  };
  const gutterSize = 24;
  const [avatarSizes, setAvatarSizes] = useState({});

  useEffect(() => {
    const autoResize = () => {
      const sizes = {
        xs: getAvatarSize(2, gutterSize),
        sm: getAvatarSize(2, gutterSize),
        md: getAvatarSize(2, gutterSize),
        lg: getAvatarSize(3, gutterSize),
        xl: getAvatarSize(3, gutterSize),
        xxl: getAvatarSize(4, gutterSize),
      };
      setAvatarSizes(sizes);
    };
    window.addEventListener("resize", autoResize);
    autoResize();
  }, []);

  rooms.forEach((room, idx) => {
    const meta = findFirstUnused(photos.filter(room.filter), metadata);
    metadata.push({ ...meta, title: room.title, id: room.id });
  });

  return loading ? (
    <Loading />
  ) : (
    <>
      <Space direction="horizontal" size={12}>
        <p>{/* For spacing */}</p>
        <Space direction="vertical">
          <p>{/* For spacing */}</p>
          <Breadcrumb separator="-">
            <Breadcrumb.Item>
              <a href={`rooms?section=${section}`}>{sectionName}</a>
            </Breadcrumb.Item>
          </Breadcrumb>
          <p>{/* For spacing */}</p>
        </Space>
      </Space>
      <ResponsiveMasonry columnsCountBreakPoints={roomsColumnsCountBreakPoints}>
        <Masonry gutter={gutterSize}>
          {metadata.map((room, idx) => {
            let href = `/room/?name=${room.id}&type=${section}`;
            return (
              <Link href={href}>
                <Space direction="vertical" style={{ textAlign: "center" }}>
                  <Avatar
                    style={{ cursor: "pointer" }}
                    shape="square"
                    size={avatarSizes}
                    src={room.thumbnail}
                  />
                  <Typography.Text style={{ cursor: "pointer" }}>{room.title}</Typography.Text>
                </Space>
              </Link>
            );
          })}
        </Masonry>
      </ResponsiveMasonry>
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
