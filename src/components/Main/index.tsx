import * as S from "./styles";

const Main = ({
  title = "Michel Ribeiro",
  description = "A janela da sua empresa pode ser feita por mim!",
}) => (
  <S.Wrapper>
    <S.Logo src="img/logo.svg" alt="React avançado" />
    <S.Title>{title}</S.Title>
    <S.Description>{description}</S.Description>
    <S.Illustration
      src="img/hero-illustration.svg"
      alt="Seja um bom desenvolvedor"
    />
  </S.Wrapper>
);

export default Main;
