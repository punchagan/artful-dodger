// Breakpoint widths taken from https://ant.design/components/layout/
export const columnsCountBreakPoints = {
  576: 2, // sm
  992: 3, // lg
  1600: 4, // xxl
};

export const viewingRoomSections = [
  { name: "artist", title: "Artist" },
  { name: "medium", title: "Medium" },
  { name: "tag", title: "Theme" },
  { name: "size", title: "Size" },
  { name: "price", title: "Price" },
  { name: "misc", title: "Availability" },
];

// Miscellaneous Rooms
export const miscRooms = [
  { title: "Full Collection", id: "all", filter: (p) => p },
  { title: "Sold", id: "sold", filter: (p) => p.sold },
];
