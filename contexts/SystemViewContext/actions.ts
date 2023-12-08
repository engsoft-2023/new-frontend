import { Dimension } from "@common/dimension";
import { Element, SystemViewActions, SystemViewState } from "./types";
import { GraphData } from "@services/graph/types";

export interface SystemViewAction {
  type: SystemViewActions;
  payload: SystemViewState;
}

export const setSelectedDimensionsAction = (
  dimensions: Dimension[]
): SystemViewAction => ({
  type: SystemViewActions.SET_DIMENSIONS,
  payload: { selectedDimensions: dimensions },
});

export const setAllCombinationsOfDataAction = (
  allCombinationsOfData: any
): SystemViewAction => ({
  type: SystemViewActions.SET_ALL_COMBINATIONS_OF_DATA,
  payload: { allCombinationsOfData },
});

export const setDataAction = (data: GraphData): SystemViewAction => ({
  type: SystemViewActions.SET_DATA,
  payload: { data },
});

export const setFilteredDataAction = (
  filteredData: GraphData
): SystemViewAction => ({
  type: SystemViewActions.SET_FILTERED_DATA,
  payload: { filteredData },
});

export const setShowModulesAction = (
  showModules: boolean
): SystemViewAction => ({
  type: SystemViewActions.SET_SHOW_MODULES,
  payload: { showModules },
});

export const setShowOperationsAction = (
  showOperations: boolean
): SystemViewAction => ({
  type: SystemViewActions.SET_SHOW_OPERATIONS,
  payload: { showOperations },
});

export const setDepthLevelAction = (depthLevel: number): SystemViewAction => ({
  type: SystemViewActions.SET_DEPTH_LEVEL,
  payload: { depthLevel },
});

export const setSelectedElementAction = (
  selectedElement: Element
): SystemViewAction => ({
  type: SystemViewActions.SET_SELECTED_ELEMENT,
  payload: { selectedElement },
});

export const setFocusedElementAction = (
  focusedElement: Element
): SystemViewAction => ({
  type: SystemViewActions.SET_FOCUSED_ELEMENT,
  payload: { focusedElement },
});
