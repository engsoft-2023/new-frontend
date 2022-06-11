import { Dimensions } from "@/types/dimensions";
import { System } from "@/types/system";
import cytoscape, { EdgeDefinition, NodeDefinition } from "cytoscape";
import GraphDataProcessor from "@/services/graph/data_processor";

type Payload = {
  system: System;
  dimensions: Dimensions;
  container: HTMLElement;
  options: { [key: string]: any };
};

export default function GraphGenerator({
  system,
  dimensions,
  container,
  options,
}: Payload) {
  const graph = GraphDataProcessor.build(system, dimensions);

  cytoscape({
    container,
    minZoom: options.zoom,
    userZoomingEnabled: false,
    boxSelectionEnabled: false,
    autounselectify: true,
    style: [
      {
        selector: "node",
        style: {
          content: "data(label)",
          width: 15,
          height: 15,
          "font-size": 7,
          "text-valign": "bottom",
          "text-halign": "center",
          "text-margin-y": 2,
        },
      },
      {
        selector: "node[type = 'database']",
        style: {
          shape: "hexagon",
          backgroundColor: "red",
        },
      },
      {
        selector: ":parent",
        style: {
          label: "",
        },
      },
      {
        selector: "edge",
        style: {
          width: 1,
          "curve-style": "unbundled-bezier",
          "target-arrow-shape": "triangle",
          "arrow-scale": 0.5,
        },
      },
      {
        selector: "edge[type = 'async']",
        style: {
          "line-style": "dashed",
        },
      },
      {
        selector: "edge[type = 'db']",
        style: {
          label: "data(label)",
          "font-size": 5,
        },
      },
    ],
    elements: {
      nodes: graph.nodes.map((node) => ({
        data: node as unknown as NodeDefinition,
      })),
      edges: graph.edges.map((edge) => ({
        data: edge as unknown,
      })) as EdgeDefinition[],
    },
    layout: {
      name: "grid",
    },
  });
}
