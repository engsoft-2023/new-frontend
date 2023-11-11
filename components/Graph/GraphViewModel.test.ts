import ForceGraph, { ForceGraphInstance, NodeObject } from "force-graph";
import { GraphViewModel } from "./GraphViewModel";
import { GraphData, GraphEdge, GraphNode } from "@services/graph/types";
import { Element } from "@contexts/SystemViewContext/types";
import { GraphUtils } from "@services/graph/utils";
import { GraphDesigner } from "@services/graph/designer";

describe(GraphViewModel, () => {
  describe(GraphViewModel.prototype.getActualData, () => {
    it("should return filtered data when it has elements", () => {
      const graphViewModel = new GraphViewModel({} as ForceGraphInstance);
      const data: GraphData = { nodes: [], links: [] };
      const filteredData: GraphData = {
        nodes: [
          { id: "1", label: "filtered1", type: "service" },
          { id: "2", label: "filtered2", type: "service" },
        ],
        links: [{ id: "1-2", source: "1", target: "2", type: "sync" }],
      };

      const actualData = graphViewModel.getActualData(data, filteredData);

      expect(actualData).toEqual(filteredData);
    });

    it("should return data object when there are no filtered elements", () => {
      const graphViewModel = new GraphViewModel({} as ForceGraphInstance);
      const data: GraphData = {
        nodes: [
          { id: "1", label: "filtered1", type: "service" },
          { id: "2", label: "filtered2", type: "service" },
        ],
        links: [{ id: "1-2", source: "1", target: "2", type: "sync" }],
      };
      const filteredData: GraphData = { nodes: [], links: [] };

      const actualData = graphViewModel.getActualData(data, filteredData);

      expect(actualData).toEqual(data);
    });
  });

  describe(GraphViewModel.prototype.getClickedNode, () => {
    it("should return the clicked node", () => {
      const graphViewModel = new GraphViewModel(ForceGraph());
      const selectedElement: Element = {
        id: "1",
        name: "foo",
        type: "services",
      };
      const expectedNode: GraphNode = {
        id: "1",
        label: "foo",
        type: "service",
      };
      graphViewModel.setGraphData({ nodes: [expectedNode], links: [] });

      const actualNode = graphViewModel.getClickedNode(selectedElement);

      expect(actualNode).toEqual(expectedNode);
    });

    it("should return undefined when there is no clicked node", () => {
      const graphViewModel = new GraphViewModel(ForceGraph());
      const selectedElement: Element = {
        id: "1",
        name: "foo",
        type: "services",
      };

      const actualNode = graphViewModel.getClickedNode(selectedElement);

      expect(actualNode).toBeUndefined();
    });
  });

  describe(GraphViewModel.prototype.getFocusedNode, () => {
    it("should return the focused node", () => {
      const graphViewModel = new GraphViewModel(ForceGraph());
      const focusedElement: Element = {
        id: "1",
        name: "foo",
        type: "services",
      };
      const expectedNode: GraphNode = {
        id: "1",
        label: "foo",
        type: "service",
      };
      graphViewModel.setGraphData({ nodes: [expectedNode], links: [] });

      const actualNode = graphViewModel.getFocusedNode(focusedElement);

      expect(actualNode).toEqual(expectedNode);
    });

    it("should return undefined when there is no focused node", () => {
      const graphViewModel = new GraphViewModel(ForceGraph());
      const focusedElement: Element = {
        id: "1",
        name: "foo",
        type: "services",
      };

      const actualNode = graphViewModel.getFocusedNode(focusedElement);

      expect(actualNode).toBeUndefined();
    });
  });

  describe(GraphViewModel.prototype.diminishNodesAndLinks, () => {
    it("should diminish all nodes and links", () => {
      const graphViewModel = new GraphViewModel(ForceGraph());
      const nodes: GraphNode[] = [
        {
          id: "1",
          label: "foo",
          type: "service",
          highlighted: true,
          clicked: true,
        },
        {
          id: "2",
          label: "bar",
          type: "service",
          highlighted: true,
          clicked: false,
        },
      ];
      const links: GraphEdge[] = [
        {
          id: "1-2",
          source: "1",
          target: "2",
          type: "sync",
          highlighted: true,
        },
      ];
      graphViewModel.setGraphData({ nodes, links });

      graphViewModel.diminishNodesAndLinks();

      expect(nodes[0].highlighted).toBeFalsy();
      expect(nodes[0].clicked).toBeFalsy();
      expect(nodes[1].highlighted).toBeFalsy();
      expect(nodes[1].clicked).toBeFalsy();
      expect(links[0].highlighted).toBeFalsy();
    });
  });

  describe(GraphViewModel.prototype.resetGraphFiltering, () => {
    it("should clear filtered data", () => {
      const graphViewModel = new GraphViewModel({} as ForceGraphInstance);
      const setFilteredData = jest.fn();

      graphViewModel.resetGraphFiltering(setFilteredData);

      expect(setFilteredData).toHaveBeenCalledTimes(1);
      expect(setFilteredData).toHaveBeenCalledWith({ nodes: [], links: [] });
    });
  });

  describe(GraphViewModel.prototype.handleGraphFiltering, () => {
    it("should call function to filter nodes around clicked node", () => {
      const graphViewModel = new GraphViewModel({} as ForceGraphInstance);
      const clickedNode: GraphNode = {
        id: "1",
        label: "foo",
        type: "service",
      };
      const depth = 1;
      const showModules = false;
      const data: GraphData = { nodes: [], links: [] };
      jest
        .spyOn(graphViewModel, "filterGraphAroundClickedNodeByDepth")
        .mockImplementation(() => {});

      graphViewModel.handleGraphFiltering(
        clickedNode,
        depth,
        showModules,
        data
      );

      expect(
        graphViewModel.filterGraphAroundClickedNodeByDepth
      ).toHaveBeenCalled();
    });

    it("should set graph data when there is no node clicked", () => {
      const graphViewModel = new GraphViewModel({} as ForceGraphInstance);
      const clickedNode = undefined;
      const depth = 1;
      const showModules = false;
      const data: GraphData = { nodes: [], links: [] };
      jest.spyOn(graphViewModel, "setGraphData").mockImplementation(() => {});
      jest
        .spyOn(graphViewModel, "filterGraphAroundClickedNodeByDepth")
        .mockImplementation(() => {});

      graphViewModel.handleGraphFiltering(
        clickedNode as unknown as GraphNode,
        depth,
        showModules,
        data
      );

      expect(graphViewModel.setGraphData).toHaveBeenCalledWith(data);
      expect(
        graphViewModel.filterGraphAroundClickedNodeByDepth
      ).not.toHaveBeenCalled();
    });
  });

  describe(GraphViewModel.prototype.filterGraphAroundClickedNodeByDepth, () => {
    it("should filter graph around clicked node by depth", () => {
      const graphViewModel = new GraphViewModel({} as ForceGraphInstance);
      const clickedNode: GraphNode = {
        id: "1",
        label: "foo",
        type: "service",
      };
      const depth = 1;
      const allNeighbors = new Set<GraphNode>([
        {
          id: "1",
          label: "foo",
          type: "service",
          highlighted: false,
        },
        {
          id: "2",
          label: "bar",
          type: "service",
          highlighted: false,
        },
      ]);
      const allLinks = new Set<GraphEdge>([
        {
          id: "1-2",
          source: "1",
          target: "2",
          type: "sync",
          highlighted: false,
        },
      ]);
      const spyOn = jest
        .spyOn(GraphUtils, "calculateNeighborsByDepth")
        .mockReturnValue({
          allNeighbors,
          allLinks,
        });
      jest.spyOn(graphViewModel, "setGraphData").mockImplementation(() => {});

      graphViewModel.filterGraphAroundClickedNodeByDepth(clickedNode, depth);

      expect(clickedNode.clicked).toBeTruthy();
      expect([...allNeighbors][0].highlighted).toBeTruthy();
      expect([...allNeighbors][1].highlighted).toBeTruthy();
      expect([...allLinks][0].highlighted).toBeTruthy();
      expect(GraphUtils.calculateNeighborsByDepth).toHaveBeenCalledWith(
        clickedNode,
        depth
      );
      expect(graphViewModel.setGraphData).toHaveBeenCalledWith({
        nodes: [clickedNode, ...allNeighbors],
        links: [...allLinks],
      });

      spyOn.mockClear();
    });
  });

  describe(GraphViewModel.prototype.onNodeClick, () => {
    it("should not do anything when clicked node type is not either service nor module", () => {
      const graphViewModel = new GraphViewModel({} as ForceGraphInstance);
      const clickedNode = { type: "operation" } as GraphNode;
      const selectedElement = {} as Element;
      const setSelectedElement = jest.fn();

      graphViewModel.onNodeClick(
        clickedNode,
        selectedElement,
        setSelectedElement
      );

      expect(setSelectedElement).not.toHaveBeenCalled();
    });

    it("should pass unselected element when clicked node has the same id as already selected element", () => {
      const graphViewModel = new GraphViewModel({} as ForceGraphInstance);
      const clickedNode = { id: "1", type: "service" } as GraphNode;
      const selectedElement = { id: "1" } as Element;
      const setSelectedElement = jest.fn();

      graphViewModel.onNodeClick(
        clickedNode,
        selectedElement,
        setSelectedElement
      );

      expect(setSelectedElement).toHaveBeenCalledWith({
        id: "",
        name: "",
        type: "services",
      });
    });

    it("should set selected element with the clicked node info", () => {
      const graphViewModel = new GraphViewModel({} as ForceGraphInstance);
      const clickedNode: GraphNode = {
        id: "1",
        label: "foo",
        type: "service",
      };
      const selectedElement: Element = {
        id: "2",
        name: "bar",
        type: "modules",
      };
      const setSelectedElement = jest.fn();

      graphViewModel.onNodeClick(
        clickedNode,
        selectedElement,
        setSelectedElement
      );

      expect(setSelectedElement).toHaveBeenCalledWith({
        id: clickedNode.id,
        name: clickedNode.label,
        type: clickedNode.type,
      });
    });
  });

  describe(GraphViewModel.prototype.onNodeFocusRequest, () => {
    it("should focus on node", () => {
      const graphViewModel = new GraphViewModel({} as ForceGraphInstance);
      const focusedNode = { x: 1.5, y: 1.7 } as unknown as GraphNode;
      jest
        .spyOn(graphViewModel, "setGraphCenterPosition")
        .mockImplementation(() => {});
      jest.spyOn(graphViewModel, "setGraphZoom").mockImplementation(() => {});

      graphViewModel.onNodeFocusRequest(focusedNode);

      expect(graphViewModel.setGraphCenterPosition).toHaveBeenCalledWith(
        focusedNode.x,
        focusedNode.y
      );
      expect(graphViewModel.setGraphZoom).toHaveBeenCalledWith(5);
    });
  });

  describe(GraphViewModel.prototype.onNodeDragEnd, () => {
    it("should not end dragging when node is not service or module", () => {
      const graphViewModel = new GraphViewModel({} as ForceGraphInstance);
      const node = { type: "operation" } as GraphNode;

      graphViewModel.onNodeDragEnd(node);

      expect(node.fx).toBeUndefined();
      expect(node.fy).toBeUndefined();
    });

    it("should set node fx and fy properties when drag ends", () => {
      const graphViewModel = new GraphViewModel({} as ForceGraphInstance);
      const node = { type: "service", x: 1.5, y: 1.7 } as unknown as GraphNode;

      graphViewModel.onNodeDragEnd(node);

      expect(node.fx).toBe(node.x);
      expect(node.fy).toBe(node.y);
    });
  });

  describe(GraphViewModel.prototype.setNodeCanvasObject, () => {
    it("should call graph designer correct method for type when node is of that type", () => {
      const graphViewModel = new GraphViewModel({} as ForceGraphInstance);
      const designer = new GraphDesigner({} as CanvasRenderingContext2D);
      const types = [
        { type: "database", method: "drawDatabase" },
        { type: "operation", method: "drawOperation" },
        { type: "service", method: "drawService" },
        { type: "module", method: "drawService" },
      ];

      types.forEach(({ type, method }) => {
        const node = { type } as GraphNode;
        jest
          .spyOn(designer, method as keyof GraphDesigner)
          .mockImplementation(() => {});

        graphViewModel.setNodeCanvasObject(node, designer);

        expect(designer[method as keyof GraphDesigner]).toHaveBeenCalledWith(
          node
        );
      });
    });
  });

  describe(GraphViewModel.prototype.setLinkCanvasObject, () => {
    it("should not call graph designer when source and target are not databases", () => {
      const graphViewModel = new GraphViewModel({} as ForceGraphInstance);
      const designer = new GraphDesigner({} as CanvasRenderingContext2D);
      const link = {
        source: { type: "service" },
        target: { type: "service" },
      } as GraphEdge;
      jest
        .spyOn(designer, "drawLinkLabelForDatabaseUsages")
        .mockImplementation(() => {});

      graphViewModel.setLinkCanvasObject(link, designer);

      expect(designer.drawLinkLabelForDatabaseUsages).not.toHaveBeenCalled();
    });

    it("should call graph designer drawLink method", () => {
      const graphViewModel = new GraphViewModel(ForceGraph());
      const designer = new GraphDesigner({} as CanvasRenderingContext2D);
      const link = {
        source: { type: "service" },
        target: { type: "database" },
      } as GraphEdge;
      jest
        .spyOn(designer, "drawLinkLabelForDatabaseUsages")
        .mockImplementation(() => {});

      graphViewModel.setLinkCanvasObject(link, designer);

      expect(designer.drawLinkLabelForDatabaseUsages).toHaveBeenCalledWith(
        expect.any(Number),
        link
      );
    });
  });

  describe(GraphViewModel.prototype.setGraphData, () => {
    it("should set graph data", () => {
      const graph = ForceGraph();
      const graphViewModel = new GraphViewModel(graph);
      const data: GraphData = { nodes: [], links: [] };

      graphViewModel.setGraphData(data);

      expect(graph.graphData()).toEqual(data);
    });
  });

  describe(GraphViewModel.prototype.centerGraph, () => {
    it("should center graph and reset zoom level", () => {
      const graphViewModel = new GraphViewModel({} as ForceGraphInstance);
      jest
        .spyOn(graphViewModel, "setGraphCenterPosition")
        .mockImplementation(() => {});
      jest.spyOn(graphViewModel, "setGraphZoom").mockImplementation(() => {});

      graphViewModel.centerGraph();

      expect(graphViewModel.setGraphCenterPosition).toHaveBeenCalledWith(0, 0);
      expect(graphViewModel.setGraphZoom).toHaveBeenCalledWith(3);
    });
  });
});
