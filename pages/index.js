import Head from 'next/head';
import Feature from '../components/Feature';
import Hero from '../components/Hero';
import Layout from '../components/Layout/Layout';

export default function Home() {
  return (
    <>
      <Head>
        <title>Michel Ribeiro</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Layout>
        <Hero />
        <Feature />
      </Layout>
    </>
  );
}
