import { useEffect } from "react";
import { AppProps } from "next/app";
import Analytics from "../util/analytics";
import * as gtag from "../util/gtag";
import { useRouter } from "next/router";
import Head from "next/head";
import GlobalStyles from "../styles/global";
import "../styles/tailwind.css";

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>Michel Ribeiro - Software engineer</title>
        <link rel="shortcut icon" href="/img/icon-512.png" />
        <link rel="apple-touch-icon" href="/img/icon-512.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#06092B" />
        <meta
          name="description"
          content="Precisa de um site, e-commerce, entre em contato."
        />
      </Head>
      <GlobalStyles />
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default App;
