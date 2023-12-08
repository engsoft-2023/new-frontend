import { Dimension } from "@common/dimension";
import { GraphFactory } from "./factory";
import {
  expectedLinksWhenBuildingGraphForModules,
  expectedLinksWhenBuildingGraphForServices,
  expectedNodesWhenBuildingGraphForModules,
  expectedNodesWhenBuildingGraphForServices,
  systemMock,
} from "./test_data";

describe("GraphDataProcessor", () => {
  it("should build a graph for services from a system", () => {
    const dimensions = [
      Dimension.SIZE,
      Dimension.DATA_COUPLING,
      Dimension.SYNC_COUPLING,
      Dimension.ASYNC_COUPLING,
    ];
    const { nodes, links } = GraphFactory.buildForServices(
      systemMock,
      dimensions
    );

    expect(nodes).toMatchObject(
      expect.arrayContaining(expectedNodesWhenBuildingGraphForServices)
    );
    expect(links).toMatchObject(
      expect.arrayContaining(expectedLinksWhenBuildingGraphForServices)
    );
  });

  it("should build a graph for modules from a system", () => {
    const dimensions = [
      Dimension.SIZE,
      Dimension.DATA_COUPLING,
      Dimension.SYNC_COUPLING,
      Dimension.ASYNC_COUPLING,
    ];
    const { nodes, links } = GraphFactory.buildForModules(
      systemMock,
      dimensions
    );

    expect(nodes).toMatchObject(
      expect.arrayContaining(expectedNodesWhenBuildingGraphForModules)
    );
    expect(links).toMatchObject(
      expect.arrayContaining(expectedLinksWhenBuildingGraphForModules)
    );
  });
});
