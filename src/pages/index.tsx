import Head from "next/head";
import Feature from "../components/Feature";
import Hero from "../components/Hero";
import Layout from "../components/Layout/Layout";

export default function Home() {
  return (
    <>
      <Head>
        <title>Michel Ribeiro</title>
      </Head>
      <Layout>
        <Hero />
        <Feature />
      </Layout>
    </>
  );
}
