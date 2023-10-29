import { System } from "@common/system";
import { GraphEdge, GraphNode } from "./types";
import { GraphUtils } from "./utils";

describe(GraphUtils, () => {
  it("should calculate neighbors by depth and return them", () => {
    const link1: GraphEdge = { id: "e1", source: "1", target: "2", type: "" };
    const link2: GraphEdge = { id: "e2", source: "2", target: "3", type: "" };
    const node3: GraphNode = { id: "3", label: "", type: "" };
    const node2: GraphNode = {
      id: "2",
      label: "",
      type: "",
      neighbors: [node3],
      links: [link2],
    };
    const node1: GraphNode = {
      id: "1",
      label: "",
      type: "",
      neighbors: [node2],
      links: [link1],
    };

    const { allNeighbors, allLinks } = GraphUtils.calculateNeighborsByDepth(
      node1,
      2
    );

    expect(allNeighbors.has(node2)).toBeTruthy();
    expect(allNeighbors.has(node3)).toBeTruthy();
    expect(allLinks.has(link1)).toBeTruthy();
    expect(allLinks.has(link2)).toBeTruthy();
  });

  it("should return a graph built for all expectedCombinations of dimensions selected", () => {
    const system: System = {
      id: "1",
      name: "InterSCity",
      description: "Platform for smart cities",
      modules: [],
      services: [],
      databases: [],
      databasesUsages: [],
      syncOperations: [],
      asyncOperations: [],
    };
    const expectedKeys = [
      "",
      "Size",
      "Data coupling",
      "Sync coupling",
      "Async coupling",
      "Size,Data coupling",
      "Size,Sync coupling",
      "Size,Async coupling",
      "Data coupling,Sync coupling",
      "Data coupling,Async coupling",
      "Sync coupling,Async coupling",
      "Size,Data coupling,Sync coupling",
      "Size,Data coupling,Async coupling",
      "Size,Sync coupling,Async coupling",
      "Data coupling,Sync coupling,Async coupling",
      "Size,Data coupling,Sync coupling,Async coupling",
    ];
    const expectedCombination = {
      forModules: {
        withOperations: {
          nodes: [],
          links: [],
        },
        withoutOperations: {
          nodes: [],
          links: [],
        },
      },
      forServices: {
        withOperations: {
          nodes: [],
          links: [],
        },
        withoutOperations: {
          nodes: [],
          links: [],
        },
      },
    };

    const result = GraphUtils.getAllCombinationsOfGraphData(system);

    expect(Object.keys(result).length).toBe(expectedKeys.length);
    expect(result).toMatchObject({
      [expectedKeys[0]]: expectedCombination,
      [expectedKeys[1]]: expectedCombination,
      [expectedKeys[2]]: expectedCombination,
      [expectedKeys[3]]: expectedCombination,
      [expectedKeys[4]]: expectedCombination,
      [expectedKeys[5]]: expectedCombination,
      [expectedKeys[6]]: expectedCombination,
      [expectedKeys[7]]: expectedCombination,
      [expectedKeys[8]]: expectedCombination,
      [expectedKeys[9]]: expectedCombination,
      [expectedKeys[10]]: expectedCombination,
      [expectedKeys[11]]: expectedCombination,
      [expectedKeys[12]]: expectedCombination,
      [expectedKeys[13]]: expectedCombination,
      [expectedKeys[14]]: expectedCombination,
    });
  });
});
