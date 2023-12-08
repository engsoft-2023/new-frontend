import { Header } from "@components/Header";
import { Container, MainContentWrapper, Title } from "./styled";
import { useRegisterSystemView } from "./hook";

export const RegisterSystemView = () => {
  const { CurrentComponent, pageTitle } = useRegisterSystemView();

  return (
    <Container>
      <Header title={pageTitle} />

      <MainContentWrapper>
        <Title>{pageTitle}</Title>

        <CurrentComponent />
      </MainContentWrapper>
    </Container>
  );
};
