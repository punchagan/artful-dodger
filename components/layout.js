import Link from "next/link";
import Head from "next/head";
import "antd/dist/antd.css";

export default function BaseLayout({ children, title = "This is the default title" }) {
  return (
    <div>
      <Head>
        <title>The Artful Dodger</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <Link href="/">
          <a>The Artful Dodger</a>
        </Link>
        <nav>
          <Link href="/about">
            <a>About</a>
          </Link>
          <Link href="/list">
            <a>Gallery</a>
          </Link>
        </nav>
      </header>

      {children}

      <footer></footer>
    </div>
  );
}
