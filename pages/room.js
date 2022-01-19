import { useRouter } from "next/router";
import BaseLayout from "../components/layout";
import PhotoList from "../components/photo-list";
import { pageStaticProps } from "../lib/page-utils";
import { tagFilter, tagToTitle } from "../lib/tag-utils";

export default function Home({ config }) {
  const router = useRouter();
  const { name } = router.query;
  const title = name ? tagToTitle(name) : "";
  const transform = (array) => array.filter(tagFilter(name));

  return (
    <BaseLayout>
      <main>
        <h1 className="title">{title}</h1>
      </main>
      <PhotoList metadataUrl={config.metadataUrl} transform={transform} />
    </BaseLayout>
  );
}

export const getStaticProps = pageStaticProps;
