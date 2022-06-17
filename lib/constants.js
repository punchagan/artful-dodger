export const viewingRoomSections = [
  { name: "price", title: "Price" },
  { name: "size", title: "Size" },
  { name: "medium", title: "Medium" },
  { name: "artist", title: "Artist" },
  { name: "tag", title: "Theme" },
  { name: "misc", title: "Miscellaneous" },
];

// Miscellaneous Rooms
export const miscRooms = [
  { title: "Full Collection", id: "all", filter: (p) => p },
  { title: "Sold", id: "sold", filter: (p) => p.sold },
];
