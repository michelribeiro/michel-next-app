import Head from "next/head";

import * as Styles from "./home.styles";

export default function Home() {
  return (
    <>
      <Head>
        <title>Michel Ribeiro</title>
      </Head>
      <Styles.Content>
        <h2>
          <a href="mailto:michel.ribeiro@michelribeiro.com.br">
            michel.ribeiro@michelribeiro.com.br
          </a>
          <br />
          <strong>COMING SOON!</strong>
          <br />
          <a href="tel:+5521979044440">+55 (21) 97904-4440</a>
          <br />
          <a href="https://github.com/michelribeiro/michelribeiro">Github</a>
          <a href="https://www.linkedin.com/in/michelribeiro/">LinkedIn</a>
        </h2>
      </Styles.Content>
    </>
  );
}
