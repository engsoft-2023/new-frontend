import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Header from "@components/Header";
import { MetricsWrapper } from "@components/MetricsWrapper";
import useSystem from "./hook";
import { DimensionsSelector } from "@components/DimensionsSelector";
import { Checkbox } from "@components/Checkbox";
import {
  BackButton,
  Container,
  GraphAndImageKeyWrapper,
  GraphAndMetricsGrid,
  GraphDepthControl,
  GraphDepthControlInput,
  ImageKeyWrapper,
  LoadingContainer,
  MainContentWrapper,
  PageHeaderWrapper,
  Title,
} from "./styled";
import { useSystemViewContext } from "@contexts/SystemViewContext";

const Graph = dynamic(() => import("@components/Graph"), { ssr: false });
const ImageKey = dynamic(() => import("@components/ImageKey/ImageKey"), {
  ssr: false,
});

const PageHeader = ({ router, title }: any) => {
  return (
    <PageHeaderWrapper>
      <BackButton type="button" onClick={() => router.back()}>
        &larr;
      </BackButton>

      <Title>{title}</Title>
    </PageHeaderWrapper>
  );
};

const GraphAndMetrics = ({ metrics }: any) => {
  const { selectedElement, setFocusedElement, depthLevel, setDepthLevel } =
    useSystemViewContext();

  return (
    <GraphAndMetricsGrid>
      <GraphAndImageKeyWrapper>
        <GraphDepthControl>
          Click on a service and type a depth level you want to see.
          <>
            Depth:
            <GraphDepthControlInput
              type="number"
              value={depthLevel}
              placeholder="Depth"
              onChange={(e) => {
                const level = parseInt(e.target.value);

                if (level >= 0) setDepthLevel(level);
              }}
            />
          </>
        </GraphDepthControl>
        <Graph />
        <ImageKeyWrapper>
          <ImageKey />
        </ImageKeyWrapper>
      </GraphAndImageKeyWrapper>

      <MetricsWrapper
        metrics={metrics}
        selectedComponent={selectedElement}
        onMetricClick={setFocusedElement}
      />
    </GraphAndMetricsGrid>
  );
};

export const SystemView = () => {
  const { showOperations, setShowOperations, showModules, setShowModules } =
    useSystemViewContext();
  const router = useRouter();
  const { loading, system, metrics }: any = useSystem(router.query.id);

  if (loading) return <LoadingContainer>Loading...</LoadingContainer>;

  return (
    <Container>
      <Header title={system.name} />

      <MainContentWrapper>
        <PageHeader router={router} title={system.name} />

        <DimensionsSelector />

        <Checkbox
          name="Link synchronous communications through operations"
          checked={showOperations}
          onChange={() => setShowOperations(!showOperations)}
        />

        <Checkbox
          name="Group services by deployment unit (Modules)"
          checked={showModules}
          onChange={() => setShowModules(!showModules)}
        />

        <GraphAndMetrics metrics={metrics} />
      </MainContentWrapper>
    </Container>
  );
};

