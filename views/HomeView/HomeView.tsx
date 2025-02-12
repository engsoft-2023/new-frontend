import Image from "next/image";
import Link from "next/link";
import { Header } from "@components/Header";
import { useSystems } from "./hook";
import { SystemsList } from "@components/SystemsList";
import { Button } from "@components/Button";
import {
  Container,
  LogoWrapper,
  MainContentWrapper,
  RegisterButtonWrapper,
  SearchInput,
  Title,
} from "./styled";

export const HomeView = () => {
  const { loading, systems, onSearch } = useSystems();

  return (
    <Container>
      <Header title="Sorting Hat" />

      <MainContentWrapper>
        <RegisterButtonWrapper>
          <Link href="/systems/register">
            <Button>Register new system</Button>
          </Link>
        </RegisterButtonWrapper>

        <LogoWrapper>
          <Image
            src="/sortinghat.png"
            alt="Sorting Hat Logo"
            width={100}
            height={100}
          />
        </LogoWrapper>

        <Title>Welcome to Sorting Hat!</Title>

        <SearchInput
          data-testid="search-input"
          type="text"
          placeholder="Search..."
          onChange={(e) => onSearch(e.target.value)}
        />

        {loading ? "Loading..." : <SystemsList systems={systems} />}
      </MainContentWrapper>
    </Container>
  );
};
