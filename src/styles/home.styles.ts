import styled from "styled-components";

export const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  h2 {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    max-width: 1080px;
    border: solid 2px #333;
    padding: 1rem;
    border-radius: 6px;

    a {
      text-decoration: none;
      color: #333;
    }
  }
`;
