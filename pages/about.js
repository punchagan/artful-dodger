import Head from "next/head";
import BaseLayout from "../components/layout";
import { PageHeader, Descriptions } from "antd";
import { pageStaticProps } from "../lib/page-utils";

export default function About({ config }) {
  return (
    <BaseLayout pageTitle={`About — ${config.title}`} siteTitle={config.title}>
      <PageHeader title="About" subTitle="Lorem ipsum dolor sit amet" />
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
        galley of type and scrambled it to make a type specimen book. It has survived not only ﬁve
        centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
        passages, and more recently with desktop publishing software like Aldus PageMaker including
        versions of Lorem Ipsum.
      </p>

      <p>
        It is a long established fact that a reader will be distracted by the readable content of a
        page when looking at its layout. The point of using Lorem Ipsum is that it has a
        more-or-less normal distribution of letters, as opposed to using' Content here, content
        here', making it look like readable English. Many desktop publishing packages and web page
        editors now use Lorem Ipsum as their default model text, and a search for'lorem ipsum' will
        uncover many web sites still in their infancy. Various versions have evolved over the years,
        sometimes by accident, sometimes on purpose (injected humour and the like).
      </p>

      <Descriptions title="Contact Us" column={1}>
        <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
        <Descriptions.Item label="Email">theartfuldodger@gmail.com</Descriptions.Item>
      </Descriptions>
    </BaseLayout>
  );
}

export const getStaticProps = pageStaticProps;
