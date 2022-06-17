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
