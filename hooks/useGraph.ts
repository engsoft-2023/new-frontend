import ForceGraph from "force-graph";
import { useEffect, useRef, useState } from "react";
import { GraphUtils } from "@services/graph/utils";
import { GraphDesigner } from "@services/graph/designer";
import { GraphEdge, GraphNode } from "@services/graph/types";

const filterGraphAroundSelectedNode = (
  myGraph: any,
  depth: any,
  clickedNode: any
) => {
  const { allNeighbors, allLinks } = GraphUtils.calculateNeighborsByDepth(
    clickedNode,
    depth
  );
  const highlightNodes = new Set();
  const highlightLinks = new Set();

  clickedNode.clicked = true;
  highlightNodes.add(clickedNode);
  allNeighbors.forEach((neighbor) => {
    neighbor.highlighted = true;
    highlightNodes.add(neighbor);
  });
  allLinks.forEach((link) => {
    link.highlighted = true;
    highlightLinks.add(link);
  });

  myGraph.graphData({
    nodes: [...highlightNodes],
    links: [...highlightLinks],
  });
};

const useGraph = ({
  system,
  dimensions,
  depth,
  seeModules,
  showOperations,
  onSelection,
  focusedComponent,
}: any) => {
  const graphRef = useRef<any>();
  const [allCombinations, setAllCombinations] = useState<any>();
  const myGraph = useRef(ForceGraph());
  const [clickedNode, setClickedNode] = useState<any>();
  const [defaultGraphData, setDefaultGraphData] = useState({
    nodes: [],
    links: [],
  });

  useEffect(() => {
    setAllCombinations(GraphUtils.getAllCombinationsOfGraphData(system));
  }, [system]);

  useEffect(() => {
    if (allCombinations === undefined) return;

    if (myGraph.current === undefined) return;

    const combination: any = allCombinations[dimensions.join(",")];
    let data = seeModules ? combination.forModules : combination.forServices;
    data = showOperations ? data.withOperations : data.withoutOperations;

    setClickedNode(false);
    setDefaultGraphData(data);
  }, [allCombinations, dimensions, seeModules, showOperations]);

  useEffect(() => {
    if (!focusedComponent) return;

    const node: any = myGraph.current
      .graphData()
      .nodes.find((node: any) => node.label === focusedComponent.name);

    myGraph.current.centerAt(node.x, node.y, 1000).zoom(5, 1000);
  }, [focusedComponent]);

  useEffect(() => {
    const width = graphRef.current.clientWidth;
    const height = graphRef.current.clientHeight;

    myGraph.current = ForceGraph()(graphRef.current)
      .width(width)
      .height(height);

    myGraph.current
      .autoPauseRedraw(false) // keep redrawing after engine has stopped
      .linkWidth((link: any) => (link.highlighted ? 5 : 1))
      .linkDirectionalParticles(4)
      .linkDirectionalParticleWidth((link: any) => (link.highlighted ? 4 : 0))
      .nodeCanvasObject((node, ctx) => {
        const designer = new GraphDesigner(ctx);
        const drawByType: any = {
          database: () => designer.drawDatabase(node as GraphNode),
          operation: () => designer.drawOperation(node as GraphNode),
          service: () => designer.drawService(node as GraphNode),
          module: () => designer.drawService(node as GraphNode),
        };

        drawByType[(node as GraphNode).type]();
      })
      .onNodeDragEnd((node: any) => {
        if (node.type !== "service" && node.type !== "module") return;
        node.fx = node.x;
        node.fy = node.y;
      })
      .linkCurvature("curvature")
      .linkCanvasObjectMode(() => "after")
      .linkCanvasObject((link, ctx) => {
        const designer = new GraphDesigner(ctx);
        if (
          (link as GraphEdge).source.type !== "database" &&
          (link as GraphEdge).target.type !== "database"
        )
          return;

        designer.drawLinkLabelForDatabaseUsages(
          myGraph.current.nodeRelSize(),
          link as GraphEdge
        );
      })
      .linkDirectionalArrowLength(6)
      .linkWidth(3)
      .linkDirectionalArrowRelPos(1)
      .linkLineDash((link: any) => link.dashed && [3, 3])
      .zoom(3)
      .centerAt(0, 0);
  }, []);

  useEffect(() => {
    myGraph.current.onNodeClick((node: any) => {
      if (node.type !== "service" && node.type !== "module") return;

      if (clickedNode && clickedNode.id === node.id) {
        setClickedNode(undefined);
        return;
      }

      if (node) {
        setClickedNode(node);
      }
    });
  }, [clickedNode]);

  useEffect(() => {
    defaultGraphData.nodes.forEach((node: any) => {
      node.highlighted = false;
      node.clicked = false;
    });
    defaultGraphData.links.forEach((link: any) => (link.highlighted = false));
    if (clickedNode) {
      if (
        (clickedNode.type === "service" && !seeModules) ||
        (clickedNode.type === "module" && seeModules)
      ) {
        filterGraphAroundSelectedNode(myGraph.current, depth, clickedNode);
      }
    } else {
      myGraph.current.graphData(defaultGraphData);
    }
  }, [depth, clickedNode, seeModules, defaultGraphData]);

  useEffect(() => {
    if (clickedNode) {
      onSelection([
        { id: clickedNode.id, type: clickedNode.type, name: clickedNode.label },
      ]);
    } else {
      onSelection([]);
    }
  }, [clickedNode, onSelection]);

  useEffect(() => {
    myGraph.current
      .graphData(defaultGraphData)
      .centerAt(0, 0, 1000)
      .zoom(3, 1000);
  }, [defaultGraphData]);

  return graphRef;
};

export default useGraph;
