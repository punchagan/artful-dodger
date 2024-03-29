// Breakpoint widths taken from https://ant.design/components/layout/
export const columnsCountBreakPoints = {
  576: 3, // sm
  992: 5, // lg
  1600: 5, // xxl
};

export const roomsColumnsCountBreakPoints = {
  576: 2, // sm
  992: 4, // lg
  1600: 4, // xxl
};

export const viewingRoomSections = [
  { name: "artist", title: "Artist" },
  { name: "medium", title: "Medium" },
  // { name: "tag", title: "Theme" },
  { name: "size", title: "Size" },
  { name: "price", title: "Price" },
  { name: "misc", title: "Availability" },
];

// Miscellaneous Rooms
export const miscRooms = [
  { title: "Full Collection", id: "all", filter: (p) => p },
  { title: "Available", id: "available", filter: (p) => !p.sold && !p.archived },
  { title: "Sold", id: "sold", filter: (p) => p.sold },
  { title: "Archived", id: "archived", filter: (p) => p.archived },
];

export const pages = [
  { title: "About", name: "about", url: "/about" },
  { title: "FAQ", name: "faq", url: "/faq" },
  { title: "Return/Exchange Policy", name: "return", url: "/return" },
  { title: "Privacy Policy", name: "privacy", url: "/privacy" },
  { title: "Terms of Service", name: "terms", url: "/terms" },
];
