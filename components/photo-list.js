import { Image, Row, Col } from "antd";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

// Breakpoint widths taken from https://ant.design/components/layout/
const columnsCountBreakPoints = {
  576: 2, // sm
  992: 3, // lg
  1600: 4, // xxl
};

export default function PhotoList({ data, openGalleryPhoto }) {
  return (
    <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
      <Masonry gutter={4}>
        {data.map((image, idx) => (
          <Image
            onClick={() => openGalleryPhoto(idx)}
            alt={image.caption}
            preview={false}
            src={image.thumbnail}
          />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
}
