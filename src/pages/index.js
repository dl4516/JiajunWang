import Head from "next/head";
import Image from "next/image";
import AirlineRoutes from "./assignment6_student"; // Make sure the path is correct

export default function Home() {
  return (
    <>
     <Head>
        <title>AirlineRoutes Visualization</title>
        <meta name="description" content="Visualization of AirlineRoutes using D3 and React with Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main style={{ margin: 0, padding: 0, backgroundColor: "white" }}>
        <AirlineRoutes />
      </main>
    </>
  );
}