import Link from "next/link";
import Head from "next/head";
import "antd/dist/antd.css";
import { Layout, Menu } from "antd";
const { Header, Content, Footer } = Layout;

export default function BaseLayout({ children, title = "This is the default title" }) {
  return (
    <>
      <Head>
        <title>The Artful Dodger</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Header>
          <Menu mode="horizontal">
            <Menu.Item key="1">
              <Link href="/">The Artful Dodger</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link href="/about">About</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link href="/list">Gallery</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content>{children}</Content>
        <Footer></Footer>
      </Layout>
    </>
  );
}
