import Head from "next/head";
import BaseLayout from "../components/layout";

export default function Home() {
  return (
    <BaseLayout>
      <div className="container">
        <main>
          <h1 className="title">Welcome to The Artful Dodger</h1>
          <p className="description">We consign, commission, buy and sell art.</p>
        </main>
      </div>
    </BaseLayout>
  );
}
