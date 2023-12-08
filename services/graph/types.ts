export interface GraphNode {
  id: string;
  label: string;
  type: string;
  operations?: string[];
  neighbors?: GraphNode[];
  links?: GraphEdge[];
  [key: string]: any;
}

export interface GraphEdge {
  id: string;
  source: any;
  target: any;
  type: string;
  dashed?: boolean;
  [key: string]: any;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphEdge[];
}

export type ComponentType = "service" | "module";
