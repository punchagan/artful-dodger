import Link from "next/link";
import BaseLayout from "../components/layout";
import PhotoList, { usePhotos } from "../components/photo-list";
import { pageStaticProps } from "../lib/page-utils";
import { tagFilter, tagToTitle } from "../lib/tag-utils";
import { Image, Row, Col, Card, Avatar, PageHeader } from "antd";

export default function Rooms({ config }) {
  const { loading, photos } = usePhotos(config.metadataUrl);
  const tags = Array.from(new Set(photos.map((x) => x.tags).flat())).sort();
  const metadata = tags.map((tag) => {
    const title = tagToTitle(tag);
    const tagPhotos = photos.filter(tagFilter(tag)).sort((a, b) => a.tags.length - b.tags.length);
    return tag.length > 0
      ? { ...tagPhotos[0], title, tag }
      : {
          thumbnail: `https://placehold.jp/30/777777/ffffff/300x150.png?text=${title}`,
          title,
          tag,
        };
  });

  return (
    <BaseLayout>
      <PageHeader
        title="Viewing Rooms"
        subTitle="View curated collections of art"
        backIcon={false}
      />
      <Row
        justify="center"
        align="middle"
        gutter={[
          { xs: 16, sm: 24, md: 32, lg: 40, xl: 40, xxl: 40 },
          { xs: 16, sm: 24, md: 32, lg: 40, xl: 40, xxl: 40 },
        ]}
      >
        {metadata.map((photo, idx) => {
          let href = `/room/?name=${photo.tag}`;
          return (
            <Col className="gutter-row" style={{ textAlign: "center" }} key={idx} span={8}>
              <Card>
                <Link href={href}>
                  <Avatar
                    shape="square"
                    size={{ xs: 128, sm: 128, md: 256, lg: 256, xl: 256, xxl: 256 }}
                    src={photo.thumbnail}
                  />
                </Link>
                <div>
                  <Link href={href}>{photo.title}</Link>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </BaseLayout>
  );
}

export const getStaticProps = pageStaticProps;
