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
