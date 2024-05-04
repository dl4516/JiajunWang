import Head from "next/head";
import dynamic from "next/dynamic";

const TerrorismDeaths = dynamic(() => import("./terrorism_deaths"), {
  ssr: false,
});
export default function Home() {
  return (
    <>
      <Head>
        <title>AirlineRoutes Visualization</title>
        <meta
          name="description"
          content="Visualization of AirlineRoutes using D3 and React with Next.js"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ margin: 0, padding: 0, backgroundColor: "white" }}>
        <TerrorismDeaths />
      </main>
    </>
  );
}
