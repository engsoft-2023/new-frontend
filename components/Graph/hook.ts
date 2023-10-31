import ForceGraph, { ForceGraphInstance } from "force-graph";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GraphUtils } from "@services/graph/utils";
import { GraphDesigner } from "@services/graph/designer";
import { GraphData, GraphEdge, GraphNode } from "@services/graph/types";
import { useSystemViewContext } from "@contexts/SystemViewContext";
import { Element } from "@contexts/SystemViewContext/types";

export const useGraph = () => {
  const {
    data,
    selectedDimensions,
    showModules,
    showOperations,
    focusedElement,
    depthLevel,
    selectedElement,
    setSelectedElement,
  } = useSystemViewContext();
  const domElementRef = useRef<any>();
  const graphRef = useRef(ForceGraph());
  const [defaultGraphData, setDefaultGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });

  const clickedNode = useMemo(
    () =>
      graphRef.current
        .graphData()
        .nodes.find((node) => node.id === selectedElement?.id) as
        | GraphNode
        | undefined,
    [selectedElement]
  );

  const focusedNode = useMemo(
    () =>
      graphRef.current
        .graphData()
        .nodes.find(
          (node) => (node as GraphNode).label === focusedElement?.name
        ),
    [focusedElement]
  );

  const diminishNodesAndLinks = useCallback(() => {
    graphRef.current.graphData().nodes.forEach((node) => {
      (node as GraphNode).highlighted = false;
      (node as GraphNode).clicked = false;
    });
    graphRef.current
      .graphData()
      .links.forEach((link) => ((link as GraphEdge).highlighted = false));
  }, []);

  const filterGraphAroundClickedNodeByDepth = useCallback(
    (clickedNode: GraphNode, depth: number) => {
      const { allNeighbors, allLinks } = GraphUtils.calculateNeighborsByDepth(
        clickedNode,
        depth
      );
      const highlightNodes = new Set<GraphNode>();
      const highlightLinks = new Set<GraphEdge>();

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

      graphRef.current.graphData({
        nodes: [...highlightNodes],
        links: [...highlightLinks],
      });
    },
    []
  );

  const handleGraphFiltering = useCallback(
    (depth: number, showModules: boolean, graphData: GraphData) => {
      if (clickedNode) {
        if (
          (clickedNode.type === "service" && !showModules) ||
          (clickedNode.type === "module" && showModules)
        ) {
          filterGraphAroundClickedNodeByDepth(clickedNode, depth);
        }
      } else {
        graphRef.current.graphData(graphData);
      }
    },
    [clickedNode, filterGraphAroundClickedNodeByDepth]
  );

  const handleNodeClick = useCallback(
    (
      node: GraphNode,
      selectedElement: Element,
      onSelectionChange: Function
    ) => {
      if (node.type !== "service" && node.type !== "module") return;

      if (selectedElement && selectedElement.id === node.id) {
        onSelectionChange({ id: "", name: "", type: "services" });
        return;
      }

      if (node) {
        onSelectionChange({
          id: node.id,
          type: node.type as "services" | "modules",
          name: node.label,
        });
      }
    },
    []
  );

  const onNodeFocusRequest = useCallback(() => {
    if (focusedNode) {
      graphRef.current
        .centerAt(focusedNode.x, focusedNode.y, 1000)
        .zoom(5, 1000);
    }
  }, [focusedNode]);

  const setNodeCanvasObject = useCallback(
    (node: GraphNode, ctx: CanvasRenderingContext2D) => {
      const designer = new GraphDesigner(ctx);
      const drawByType = {
        database: () => designer.drawDatabase(node),
        operation: () => designer.drawOperation(node),
        service: () => designer.drawService(node),
        module: () => designer.drawService(node),
      };

      drawByType[node.type as keyof typeof drawByType]();
    },
    []
  );

  const setLinkCanvasObject = useCallback(
    (link: GraphEdge, ctx: CanvasRenderingContext2D) => {
      const designer = new GraphDesigner(ctx);
      if (link.source.type !== "database" && link.target.type !== "database")
        return;

      designer.drawLinkLabelForDatabaseUsages(
        graphRef.current.nodeRelSize(),
        link
      );
    },
    []
  );

  const onNodeDragEnd = useCallback((node: GraphNode) => {
    if (node.type !== "service" && node.type !== "module") return;
    node.fx = node.x;
    node.fy = node.y;
  }, []);

  const configureGraph = useCallback(() => {
    const width = domElementRef.current.clientWidth;
    const height = domElementRef.current.clientHeight;

    graphRef.current = ForceGraph()(domElementRef.current)
      .width(width)
      .height(height);

    graphRef.current
      .autoPauseRedraw(false) // keep redrawing after engine has stopped
      .linkWidth((link) => ((link as GraphEdge).highlighted ? 5 : 1))
      .linkDirectionalParticles(4)
      .linkDirectionalParticleWidth((link) =>
        (link as GraphEdge).highlighted ? 4 : 0
      )
      .nodeCanvasObject((node, ctx) =>
        setNodeCanvasObject(node as GraphNode, ctx)
      )
      .onNodeDragEnd((node) => onNodeDragEnd(node as GraphNode))
      .linkCurvature("curvature")
      .linkCanvasObjectMode(() => "after")
      .linkCanvasObject((link, ctx) =>
        setLinkCanvasObject(link as GraphEdge, ctx)
      )
      .linkDirectionalArrowLength(6)
      .linkWidth(3)
      .linkDirectionalArrowRelPos(1)
      .linkLineDash((link) => ((link as GraphEdge).dashed ? [3, 3] : null))
      .zoom(3)
      .centerAt(0, 0);
  }, [setNodeCanvasObject, onNodeDragEnd, setLinkCanvasObject]);

  useEffect(() => {
    console.log("one");
    if (graphRef.current === undefined) return;

    setDefaultGraphData(data!);
  }, [selectedDimensions, data, showModules, showOperations]);

  useEffect(() => {
    console.log("two");
    onNodeFocusRequest();
  }, [focusedElement, onNodeFocusRequest]);

  useEffect(() => {
    console.log("four");
    graphRef.current.onNodeClick((node) =>
      handleNodeClick(node as GraphNode, selectedElement!, setSelectedElement)
    );
  }, [selectedElement, setSelectedElement, handleNodeClick]);

  useEffect(() => {
    console.log("five");
    diminishNodesAndLinks();
    handleGraphFiltering(depthLevel!, showModules || false, defaultGraphData);
  }, [
    depthLevel,
    showModules,
    defaultGraphData,
    diminishNodesAndLinks,
    handleGraphFiltering,
  ]);

  useEffect(() => {
    console.log("three");
    configureGraph();
  }, [configureGraph]);

  useEffect(() => {
    console.log("seven");
    graphRef.current
      .graphData(defaultGraphData)
      .centerAt(0, 0, 1000)
      .zoom(3, 1000);
  }, [defaultGraphData]);

  return domElementRef;
};
