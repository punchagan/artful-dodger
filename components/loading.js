import { Image, Spin, Tag, Button } from "antd";

export default function Loading() {
  return (
    <div
      style={{
        alignItems: "center",
        justifyContent: "center",
        minHeight: "600px",
        display: "flex",
      }}
    >
      <Spin />
    </div>
  );
}
