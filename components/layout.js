import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import "antd/dist/antd.css";
import { Layout, Menu } from "antd";
const { Header, Content, Footer } = Layout;

export default function BaseLayout({ children, title = "This is the default title" }) {
  const router = useRouter();
  const paths = [
    { name: "/", title: "The Artful Dodger" },
    { name: "/viewing-rooms", title: "Viewing Rooms", otherPath: "/room" },
    { name: "/about", title: "About" },
  ];
  const selectedKeys = paths.reduce(
    (acc, p) =>
      p.name === router.pathname || p.otherPath === router.pathname ? [...acc, p.name] : acc,
    []
  );

  return (
    <>
      <Head>
        <title>The Artful Dodger</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            triggerSubMenuAction="click"
            selectedKeys={selectedKeys}
          >
            {paths.map((path, idx) => (
              <Menu.Item key={path.name}>
                <Link href={path.name}>{path.title}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </Header>
        <Content style={{ minWidth: "60%" }}>{children}</Content>
        <Footer></Footer>
      </Layout>
    </>
  );
}
