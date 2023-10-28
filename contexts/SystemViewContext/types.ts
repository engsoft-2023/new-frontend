export interface Element {
  type?: "modules" | "services";
  name: string;
}

export interface SystemViewState {
  selectedDimensions?: string[];
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
}
