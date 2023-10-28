import { useContext } from "react";
import {
  setDepthLevelAction,
  setFocusedElementAction,
  setSelectedDimensionsAction,
  setSelectedElementAction,
  setShowModulesAction,
  setShowOperationsAction,
} from "./actions";
import { Element } from "./types";
import { SystemViewContext } from "./SystemViewContext";

export const useSystemViewContext = () => {
  const { state, dispatch } = useContext(SystemViewContext);

  const setSelectedDimensions = (dimensions: string[]) =>
    dispatch(setSelectedDimensionsAction(dimensions));

  const setShowModules = (showModules: boolean) =>
    dispatch(setShowModulesAction(showModules));

  const setShowOperations = (showOperations: boolean) =>
    dispatch(setShowOperationsAction(showOperations));

  const setDepthLevel = (depthLevel: number) =>
    dispatch(setDepthLevelAction(depthLevel));

  const setSelectedElement = (selectedElement: Element) =>
    dispatch(setSelectedElementAction(selectedElement));

  const setFocusedElement = (focusedElement: Element) =>
    dispatch(setFocusedElementAction(focusedElement));

  return {
    ...state,
    setSelectedDimensions,
    setShowModules,
    setShowOperations,
    setDepthLevel,
    setSelectedElement,
    setFocusedElement,
  };
};
