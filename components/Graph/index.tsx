import { GraphContainer, GraphWrapper } from "./styled";
import { useGraph } from "./hook";

const Graph = () => {
  const graphRef = useGraph();

  return (
    <GraphContainer>
      <GraphWrapper ref={graphRef}></GraphWrapper>
    </GraphContainer>
  );
};

export default Graph;
