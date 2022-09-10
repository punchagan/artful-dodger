export const toTitle = (tag) =>
  tag
    ?.trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const tagFilter = (name) => (e) => e.tags?.findIndex((it) => it === name) > -1;

export const artistFilter = (artist) => (p) => p.artist === artist;

export const getMedium = (p) => p?.medium?.split(" on ")[0];
export const mediumFilter = (medium) => (p) => getMedium(p) === medium;

const sizes = ["small", "medium", "large"];
export const sizeCompare = (a, b) => sizes.indexOf(b) < sizes.indexOf(a);
export const getSize = (p) => {
  const area = p?.height * p?.width;
  const sizes = ["small", "medium", "large"];
  const smallArea = 900; // 30 * 30;
  const mediumArea = 2700; // 60 * 45;
  return area < smallArea ? sizes[0] : smallArea <= area && area < mediumArea ? sizes[1] : sizes[2];
};
export const sizeFilter = (size) => (p) => getSize(p) === size;

const prices = ["< ₹ 10000", "₹ 10000 — ₹ 20000", "> ₹ 20000"];
export const priceRangeCompare = (a, b) => prices.indexOf(b) < prices.indexOf(a);
export const getPriceRange = (p) => {
  const price = p?.price;
  return price < 10_000 ? prices[0] : 10_000 <= price && price < 20_000 ? prices[1] : prices[2];
};
export const priceFilter = (priceRange) => (p) => getPriceRange(p) === priceRange;
