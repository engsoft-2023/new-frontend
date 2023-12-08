import { useContext } from "react";
import {
  setAllCombinationsOfDataAction,
  setDataAction,
  setDepthLevelAction,
  setFilteredDataAction,
  setFocusedElementAction,
  setSelectedDimensionsAction,
  setSelectedElementAction,
  setShowModulesAction,
  setShowOperationsAction,
} from "./actions";
import { Element } from "./types";
import { SystemViewContext } from "./SystemViewContext";
import { Dimension } from "@common/dimension";
import { System } from "@common/system";
import { GraphUtils } from "@services/graph/utils";
import { GraphData } from "@services/graph/types";

export const useSystemViewContext = () => {
  const { state, dispatch } = useContext(SystemViewContext);

  const setSelectedDimensions = (dimensions: Dimension[]) => {
    dispatch(setSelectedDimensionsAction(dimensions));
    updateDataFromSelectedCombination(dimensions, state.allCombinationsOfData);
  };

  const setAllCombinationsOfData = (system: System) => {
    const allCombinations = GraphUtils.getAllCombinationsOfGraphData(system);
    dispatch(setAllCombinationsOfDataAction(allCombinations));
    updateDataFromSelectedCombination(
      state.selectedDimensions!,
      allCombinations
    );
  };

  const setData = (data: GraphData) => dispatch(setDataAction(data));

  const setFilteredData = (filteredData: GraphData) =>
    dispatch(setFilteredDataAction(filteredData));

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

  const updateDataFromSelectedCombination = (
    dimensions: Dimension[],
    allCombinations: any
  ) => {
    const combination = allCombinations[dimensions.join(",") || ""];
    let data = state.showModules
      ? combination.forModules
      : combination.forServices;
    data = state.showOperations ? data.withOperations : data.withoutOperations;
    setData(data);
  };

  return {
    ...state,
    setAllCombinationsOfData,
    setData,
    setFilteredData,
    setSelectedDimensions,
    setShowModules,
    setShowOperations,
    setDepthLevel,
    setSelectedElement,
    setFocusedElement,
  };
};
