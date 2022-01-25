export const tagFilter = (name) => (e) => e.tags?.findIndex((it) => it === name) > -1;
export const tagToTitle = (tag) =>
  tag
    ?.trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
