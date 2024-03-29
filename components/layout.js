import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import "antd/dist/antd.css";
import { Col, Row, Layout, Menu } from "antd";
const { Header, Content, Footer } = Layout;
import { viewingRoomSections } from "../lib/constants";

export default function BaseLayout({ children, siteTitle, pageTitle, pages }) {
  const router = useRouter();
  const subMenu = viewingRoomSections;
  const paths = [
    { name: "/", title: siteTitle },
    { name: "/rooms", alternateName: "/room", title: "Filter", subMenu },
    { name: "/about", title: "About" },
  ];
  const selectedKeys = paths.reduce(
    (acc, p) =>
      p.name === router.pathname || p.alternateName === router.pathname ? [...acc, p.name] : acc,
    []
  );

  const backgroundColor = "#ffffff";
  const year = new Date().getYear() + 1900;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout style={{ backgroundColor }}>
        <Header style={{ backgroundColor }}>
          <Link href="/">
            <a className="logo" />
          </Link>
          <Menu
            mode="horizontal"
            triggerSubMenuAction="click"
            selectedKeys={selectedKeys}
            style={{ backgroundColor }}
          >
            {paths.map((path, idx) =>
              path.subMenu ? (
                <Menu.SubMenu key={path.name} title={path.title} style={{ backgroundColor }}>
                  {path.subMenu.map((section) => (
                    <Menu.Item key={section.name}>
                      <Link href={`${path.name}?section=${section.name}`}>{section.title}</Link>
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              ) : (
                <Menu.Item key={path.name}>
                  <Link href={path.name}>{path.title}</Link>
                </Menu.Item>
              )
            )}
          </Menu>
        </Header>
        <Content style={{ minWidth: "100%", padding: "0px" }}>{children}</Content>
        <Footer
          style={{
            backgroundColor,
          }}
        >
          {pages && (
            <div className="footer-links">
              {pages?.map((page) => (
                <Row key={page.name}>
                  <Col span={24}>
                    <Link href={page.url}>{page.title}</Link>
                  </Col>
                </Row>
              ))}
            </div>
          )}
          <Row style={{ textAlign: "center" }}>
            <Col span={24}>
              © {siteTitle} {year}
            </Col>
          </Row>
        </Footer>
      </Layout>
    </>
  );
}
