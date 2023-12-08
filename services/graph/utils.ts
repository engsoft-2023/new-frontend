import { System } from "@common/system";
import { GraphEdge, GraphNode } from "./types";
import { Dimension } from "@common/dimension";
import { GraphFactory } from "./processor/factory";

export class GraphUtils {
  public static addNeighborsToNodes(nodes: GraphNode[], links: GraphEdge[]) {
    links.forEach((link) => {
      const a = nodes.find((n) => n.id === link.source)!;
      const b = nodes.find((n) => n.id === link.target)!;
      !a.neighbors && (a.neighbors = []);
      !b.neighbors && (b.neighbors = []);
      a.neighbors.push(b);
      b.neighbors.push(a);

      !a.links && (a.links = []);
      !b.links && (b.links = []);
      a.links.push(link);
      b.links.push(link);
    });
  }

  public static curveOverlappingLinks(links: GraphEdge[]) {
    const selfLoopLinks: { [key: string]: GraphEdge[] } = {};
    const sameNodesLinks: { [key: string]: GraphEdge[] } = {};
    const curvatureMinMax = 0.5;

    // 1. assign each link a nodePairId that combines their source and target independent of the links direction
    // 2. group links together that share the same two nodes or are self-loops
    links.forEach((link) => {
      link.nodePairId =
        link.source <= link.target
          ? link.source + "_" + link.target
          : link.target + "_" + link.source;
      const map: { [key: string]: GraphEdge[] } =
        link.source === link.target ? selfLoopLinks : sameNodesLinks;
      if (!map[link.nodePairId]) {
        map[link.nodePairId] = [];
      }
      map[link.nodePairId].push(link);
    });

    // Compute the curvature for self-loop links to avoid overlaps
    Object.keys(selfLoopLinks).forEach((id) => {
      const links = selfLoopLinks[id];
      const lastIndex = links.length - 1;
      links[lastIndex].curvature = 1;
      const delta = (1 - curvatureMinMax) / lastIndex;
      for (let i = 0; i < lastIndex; i++) {
        links[i].curvature = curvatureMinMax + i * delta;
      }
    });

    // Compute the curvature for links sharing the same two nodes to avoid overlaps
    Object.keys(sameNodesLinks)
      .filter((nodePairId) => sameNodesLinks[nodePairId].length > 1)
      .forEach((nodePairId) => {
        const links = sameNodesLinks[nodePairId];
        const lastIndex = links.length - 1;
        const lastLink = links[lastIndex];
        lastLink.curvature = curvatureMinMax;
        const delta = (2 * curvatureMinMax) / lastIndex;
        for (let i = 0; i < lastIndex; i++) {
          links[i].curvature = -curvatureMinMax + i * delta;
          if (lastLink.source !== links[i].source) {
            links[i].curvature *= -1; // flip it around, otherwise they overlap
          }
        }
      });
  }

  public static getAllCombinationsOfGraphData(system: System) {
    return this.generateAllSubsetsFromDimensions([
      Dimension.SIZE,
      Dimension.DATA_COUPLING,
      Dimension.SYNC_COUPLING,
      Dimension.ASYNC_COUPLING,
    ]).reduce(
      (acc, comb) => ({
        ...acc,
        [comb.join(",")]: {
          forServices: {
            withOperations: GraphFactory.buildForServices(system, comb, {
              showOperations: true,
            }),
            withoutOperations: GraphFactory.buildForServices(system, comb, {
              showOperations: false,
            }),
          },
          forModules: {
            withOperations: GraphFactory.buildForModules(system, comb, {
              showOperations: true,
            }),
            withoutOperations: GraphFactory.buildForModules(system, comb, {
              showOperations: false,
            }),
          },
        },
      }),
      {}
    );
  }

  public static calculateNeighborsByDepth(node: GraphNode, depth: number) {
    const allNeighbors = new Set<GraphNode>();
    const allLinks = new Set<GraphEdge>();
    const visited = new Set<string>();
    const queue: { currNode: GraphNode; level: number }[] = [];

    queue.push({ currNode: node, level: 0 });

    while (queue.length > 0) {
      const { currNode, level } = queue.shift()!;

      if (level === depth) continue;
      if (!currNode.neighbors) continue;

      for (let i = 0; i < currNode.neighbors.length; i++) {
        const neighbor = currNode.neighbors[i];
        allLinks.add(
          currNode.links?.find((link) => {
            const targetId =
              typeof link.target === "object" ? link.target.id : link.target;
            const sourceId =
              typeof link.source === "object" ? link.source.id : link.source;
            return targetId === neighbor.id || sourceId === neighbor.id;
          })!
        );

        if (!visited.has(neighbor.id)) {
          visited.add(neighbor.id);
          allNeighbors.add(neighbor);
          queue.push({ currNode: neighbor, level: level + 1 });
        }
      }
    }

    return { allNeighbors, allLinks };
  }

  private static generateAllSubsetsFromDimensions(
    dimensions: Dimension[]
  ): Dimension[][] {
    const calculateSubsets = (
      dimensions: Dimension[],
      result: Dimension[][],
      currentSubset: Dimension[],
      index: number
    ) => {
      // Add the current subset to the result list
      result.push([...currentSubset]);

      // Generate subsets by recursively including and excluding elements
      for (let i = index; i < dimensions.length; i++) {
        // Include the current element in the subset
        currentSubset.push(dimensions[i]);

        // Recursively generate subsets with the current element included
        calculateSubsets(dimensions, result, currentSubset, i + 1);

        // Exclude the current element from the subset (backtracking)
        currentSubset.pop();
      }
    };

    const result: Dimension[][] = [];
    const currentSubset: Dimension[] = [];
    let index = 0;
    calculateSubsets(dimensions, result, currentSubset, index);

    return result;
  }
}
