import { Element } from "@contexts/SystemViewContext/types";
import { GraphDesigner } from "@services/graph/designer";
import { GraphEdge, GraphNode } from "@services/graph/types";
import { GraphUtils } from "@services/graph/utils";
import { ForceGraphInstance, GraphData } from "force-graph";

export class GraphViewModel {
  private graph: ForceGraphInstance;

  constructor(forceGraphInstance: ForceGraphInstance) {
    this.graph = forceGraphInstance;
  }

  public getActualData(data: GraphData, filteredData: GraphData): GraphData {
    return filteredData.nodes.length > 0 || filteredData.links.length > 0
      ? filteredData
      : data;
  }

  public getClickedNode(selectedElement: Element): GraphNode {
    return this.graph
      .graphData()
      .nodes.find((node) => node.id === selectedElement?.id) as GraphNode;
  }

  public getFocusedNode(focusedElement: Element): GraphNode {
    return this.graph
      .graphData()
      .nodes.find(
        (node) => (node as GraphNode).label === focusedElement?.name
      ) as GraphNode;
  }

  public diminishNodesAndLinks() {
    this.graph.graphData().nodes.forEach((node) => {
      (node as GraphNode).highlighted = false;
      (node as GraphNode).clicked = false;
    });
    this.graph
      .graphData()
      .links.forEach((link) => ((link as GraphEdge).highlighted = false));
  }

  public resetGraphFiltering(setFilteredData: Function) {
    setFilteredData({ nodes: [], links: [] });
  }

  public handleGraphFiltering(
    clickedNode: GraphNode,
    depth: number,
    showModules: boolean,
    graphData: GraphData
  ) {
    if (clickedNode) {
      if (
        (clickedNode.type === "service" && !showModules) ||
        (clickedNode.type === "module" && showModules)
      ) {
        this.filterGraphAroundClickedNodeByDepth(clickedNode, depth);
      }
    } else {
      this.setGraphData(graphData);
    }
  }

  public filterGraphAroundClickedNodeByDepth(
    clickedNode: GraphNode,
    depth: number
  ) {
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

    this.setGraphData({
      nodes: [...highlightNodes],
      links: [...highlightLinks],
    });
  }

  public onNodeClick(
    node: GraphNode,
    selectedElement: Element,
    onSelectionChange: Function
  ) {
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
  }

  public onNodeFocusRequest(focusedNode: GraphNode) {
    if (focusedNode) {
      this.setGraphCenterPosition(focusedNode.x, focusedNode.y);
      this.setGraphZoom(5);
    }
  }

  public onNodeDragEnd(node: GraphNode) {
    if (node.type !== "service" && node.type !== "module") return;
    node.fx = node.x;
    node.fy = node.y;
  }

  public setNodeCanvasObject(node: GraphNode, designer: GraphDesigner) {
    const drawByType = {
      database: () => designer.drawDatabase(node),
      operation: () => designer.drawOperation(node),
      service: () => designer.drawService(node),
      module: () => designer.drawService(node),
    };

    drawByType[node.type as keyof typeof drawByType]();
  }

  public setLinkCanvasObject(link: GraphEdge, designer: GraphDesigner) {
    if (link.source.type !== "database" && link.target.type !== "database")
      return;

    designer.drawLinkLabelForDatabaseUsages(this.graph.nodeRelSize(), link);
  }

  public setNodeClickHandlerOnGraph(
    selectedElement: Element,
    setSelectedElement: Function
  ) {
    this.graph.onNodeClick((node) =>
      this.onNodeClick(node as GraphNode, selectedElement, setSelectedElement)
    );
  }

  public setGraphData(data: GraphData) {
    this.graph.graphData(data);
  }

  public setGraphZoom(zoomLevel: number) {
    this.graph.zoom(zoomLevel, 1000);
  }

  public setGraphCenterPosition(x: number, y: number) {
    this.graph.centerAt(x, y, 1000);
  }

  public centerGraph() {
    this.setGraphCenterPosition(0, 0);
    this.setGraphZoom(3);
  }

  public configureGraph(domElement: HTMLElement) {
    if (!domElement) return;

    const width = domElement.clientWidth;
    const height = domElement.clientHeight;

    this.graph(domElement)
      .width(width)
      .height(height)
      .autoPauseRedraw(false)
      .linkWidth((link) => ((link as GraphEdge).highlighted ? 5 : 1))
      .linkDirectionalParticles(4)
      .linkDirectionalParticleWidth((link) =>
        (link as GraphEdge).highlighted ? 4 : 0
      )
      .nodeCanvasObject((node, ctx) =>
        this.setNodeCanvasObject(node as GraphNode, new GraphDesigner(ctx))
      )
      .onNodeDragEnd((node) => this.onNodeDragEnd(node as GraphNode))
      .linkCurvature("curvature")
      .linkCanvasObjectMode(() => "after")
      .linkCanvasObject((link, ctx) =>
        this.setLinkCanvasObject(link as GraphEdge, new GraphDesigner(ctx))
      )
      .linkDirectionalArrowLength(6)
      .linkWidth(3)
      .linkDirectionalArrowRelPos(1)
      .linkLineDash((link) => ((link as GraphEdge).dashed ? [3, 3] : null))
      .zoom(3)
      .centerAt(0, 0);
  }
}
