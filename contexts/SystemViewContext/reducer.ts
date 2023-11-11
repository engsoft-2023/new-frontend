import { SystemViewAction } from "./actions";
import { SystemViewActions, SystemViewState } from "./types";

export const systemViewReducer = (
  state: SystemViewState,
  { type, payload }: SystemViewAction
): SystemViewState => {
  switch (type) {
    case SystemViewActions.SET_DIMENSIONS:
      return {
        ...state,
        selectedDimensions: payload.selectedDimensions,
      };
    case SystemViewActions.SET_ALL_COMBINATIONS_OF_DATA:
      return {
        ...state,
        allCombinationsOfData: payload.allCombinationsOfData,
      };
    case SystemViewActions.SET_DATA:
      return {
        ...state,
        data: payload.data,
      };
    case SystemViewActions.SET_FILTERED_DATA:
      return {
        ...state,
        filteredData: payload.filteredData,
      };
    case SystemViewActions.SET_SHOW_MODULES:
      return {
        ...state,
        showModules: payload.showModules,
      };
    case SystemViewActions.SET_SHOW_OPERATIONS:
      return {
        ...state,
        showOperations: payload.showOperations,
      };
    case SystemViewActions.SET_DEPTH_LEVEL:
      return {
        ...state,
        depthLevel: payload.depthLevel,
      };
    case SystemViewActions.SET_SELECTED_ELEMENT:
      return {
        ...state,
        selectedElement: payload.selectedElement,
      };
    case SystemViewActions.SET_FOCUSED_ELEMENT:
      return {
        ...state,
        focusedElement: payload.focusedElement,
      };
    default:
      throw new Error("invalid system view action type");
  }
};
