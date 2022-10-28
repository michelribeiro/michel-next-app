import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }
  body {
    -webkit-font-smoothing: antialiased;
  }

  body, input, button {
    font: 14px Roboto, sans-serif;
  }

  html, body, #__next {
    height: 100%;
  }

  body {
    font-family: Roboto, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

export default GlobalStyles;
