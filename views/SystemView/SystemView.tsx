import dynamic from "next/dynamic";
import { NextRouter, useRouter } from "next/router";
import { Header } from "@components/Header";
import { CharM } from "@common/metrics";
import { MetricsWrapper } from "@components/MetricsWrapper";
import { useSystem } from "./hook";
import { DimensionsSelector } from "@components/DimensionsSelector";
import { Checkbox } from "@components/Checkbox";
import { useSystemViewContext } from "@contexts/SystemViewContext";
import {
  BackButton,
  Container,
  GraphAndImageKeyWrapper,
  GraphAndMetricsGrid,
  GraphDepthControl,
  GraphDepthControlInput,
  GraphDepthControlInputWrapper,
  ImageKeyWrapper,
  LoadingContainer,
  MainContentWrapper,
  PageHeaderWrapper,
  Title,
} from "./styled";

const Graph = dynamic(() => import("@components/Graph"), { ssr: false });
const ImageKey = dynamic(() => import("@components/ImageKey/ImageKey"), {
  ssr: false,
});

const PageHeader = ({
  router,
  title,
}: {
  router: NextRouter;
  title: string;
}) => {
  return (
    <PageHeaderWrapper>
      <BackButton
        data-testid="back-button"
        type="button"
        onClick={() => router.back()}
      >
        &larr;
      </BackButton>

      <Title>{title}</Title>
    </PageHeaderWrapper>
  );
};

const GraphAndMetrics = ({ metrics }: { metrics: CharM }) => {
  const { depthLevel, setDepthLevel } = useSystemViewContext();

  return (
    <GraphAndMetricsGrid>
      <GraphAndImageKeyWrapper>
        <GraphDepthControl>
          Click on a service and type a depth level you want to see.
          <GraphDepthControlInputWrapper>
            Depth:
            <GraphDepthControlInput
              data-testid="depth-level-input"
              type="number"
              value={depthLevel}
              placeholder="Depth"
              onChange={(e) => {
                const level = parseInt(e.target.value);

                if (level >= 0) setDepthLevel(level);
              }}
            />
          </GraphDepthControlInputWrapper>
        </GraphDepthControl>
        <Graph />
        <ImageKeyWrapper>
          <ImageKey />
        </ImageKeyWrapper>
      </GraphAndImageKeyWrapper>

      <MetricsWrapper charM={metrics} />
    </GraphAndMetricsGrid>
  );
};

export const SystemView = () => {
  const { showOperations, setShowOperations, showModules, setShowModules } =
    useSystemViewContext();
  const router = useRouter();
  const { loading, system, metrics } = useSystem(router.query.id as string);

  if (loading) return <LoadingContainer>Loading...</LoadingContainer>;

  return (
    <Container>
      <Header title={system.name} />

      <MainContentWrapper>
        <PageHeader router={router} title={system.name} />

        <DimensionsSelector />

        <Checkbox
          data-testid="show-operations"
          name="Link synchronous communications through operations"
          checked={showOperations}
          onChange={() => setShowOperations(!showOperations)}
        />

        <Checkbox
          data-testid="show-modules"
          name="Group services by deployment unit (Modules)"
          checked={showModules}
          onChange={() => setShowModules(!showModules)}
        />

        <GraphAndMetrics metrics={metrics} />
      </MainContentWrapper>
    </Container>
  );
};
