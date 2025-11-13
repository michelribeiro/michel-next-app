import Head from "next/head";
import Image from "next/image";

import * as Styles from "./home.styles";
// import Teste from "components/Teste";

export default function Home() {
  return (
    <>
      <Head>
        <title>Michel Ribeiro</title>
      </Head>
      <Styles.Content>
        <Image
          src="/logo-michel.png"
          width={362}
          height={178}
          alt="Michel Ribeiro"
        ></Image>

        <h2>
          <a href="mailto:michel.ribeiro@michelribeiro.com.br">
            michel.ribeiro@michelribeiro.com.br
          </a>
          <br />
          <a href="tel:+5521979044440">+55 (21) 97904-4440</a>
          <br />
          <a href="https://github.com/michelribeiro/michelribeiro">Github</a>
          <a href="https://www.linkedin.com/in/michelribeiro/">LinkedIn</a>
        </h2>
        <div className="content-Main">
          <p>Content P</p>
        </div>
      </Styles.Content>
    </>
  );
}
