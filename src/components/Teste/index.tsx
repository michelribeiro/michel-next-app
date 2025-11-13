import * as S from "./styles";

interface TesteProps {
  data: string;
}
const Teste = ({ data }: TesteProps) => (
  <S.Wrapper>
    <h1>Teste {data}</h1>
  </S.Wrapper>
);

export default Teste;
