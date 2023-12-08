import Link from "next/link";
import { System } from "@common/system";
import { Card, CardDescription, CardTitle, ContentWrapper } from "./styled";

interface SystemsListProps {
  systems: System[];
}

const SystemNotFound = () => <>There are no systems.</>;

const List = ({ systems }: SystemsListProps) => {
  const getSystemUrl = (id: string) => `/systems/${id}`;

  return systems.map(({ id, name, description }: any) => (
    <Link key={name} href={getSystemUrl(id)}>
      <Card>
        <CardTitle>{name} &rarr;</CardTitle>
        <CardDescription>{description}</CardDescription>
      </Card>
    </Link>
  ));
};

const Content = ({ systems }: SystemsListProps) =>
  systems.length > 0 ? <List systems={systems} /> : <SystemNotFound />;

export const SystemsList = ({ systems }: SystemsListProps) => {
  return (
    <ContentWrapper>
      <Content systems={systems} />
    </ContentWrapper>
  );
};
