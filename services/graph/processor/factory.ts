import { Dimension } from "@common/dimension";
import { System } from "@common/system";
import { GraphUtils } from "@services/graph/utils";
import { GraphDataProcessor } from "./processor";
import { ComponentType, GraphData, GraphEdge } from "../types";

interface ProcessOptions {
  showOperations?: boolean;
}

export class GraphFactory {
  public static buildForServices(
    system: System,
    dimensions: Dimension[],
    options: ProcessOptions = {}
  ): GraphData {
    return this.build(system, dimensions, "service", options);
  }

  public static buildForModules(
    system: System,
    dimensions: Dimension[],
    options: ProcessOptions = {}
  ): GraphData {
    return this.build(system, dimensions, "module", options);
  }

  private static build(
    system: System,
    dimensions: Dimension[],
    componentType: ComponentType,
    options: ProcessOptions
  ): GraphData {
    const processor = new GraphDataProcessor(system, componentType);
    const buildOptions = {
      [Dimension.SIZE]: () => processor.viewSize(),
      [Dimension.DATA_COUPLING]: () => processor.viewDataCoupling(),
      [Dimension.SYNC_COUPLING]: () =>
        options.showOperations
          ? processor.viewSyncCoupling()
          : processor.viewSyncWithoutOperations(),
      [Dimension.ASYNC_COUPLING]: () => processor.viewAsyncCoupling(),
    };

    dimensions.forEach((dimension) => buildOptions[dimension]());

    GraphUtils.curveOverlappingLinks(processor.edges);
    GraphUtils.addNeighborsToNodes(processor.nodes, processor.edges);

    return {
      nodes: processor.nodes.map((node) => ({ ...node })),
      links: processor.edges.map((edge) => ({
        ...(edge as GraphEdge),
        dashed: edge.type === "async",
      })),
    };
  }
}
