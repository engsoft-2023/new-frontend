import { Dimension } from "@common/dimension";
import { GraphData } from "@services/graph/types";

export interface Element {
  id?: string;
  type?: "module" | "service";
  name: string;
}

export interface SystemViewState {
  selectedDimensions?: Dimension[];
  allCombinationsOfData?: {};
  data?: GraphData;
  filteredData?: GraphData;
  showModules?: boolean;
  showOperations?: boolean;
  depthLevel?: number;
  selectedElement?: Element;
  focusedElement?: Element;
}

export enum SystemViewActions {
  SET_DIMENSIONS,
  SET_SHOW_MODULES,
  SET_SHOW_OPERATIONS,
  SET_DEPTH_LEVEL,
  SET_SELECTED_ELEMENT,
  SET_FOCUSED_ELEMENT,
  SET_ALL_COMBINATIONS_OF_DATA,
  SET_DATA,
  SET_FILTERED_DATA,
}
