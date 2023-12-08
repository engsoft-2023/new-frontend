import ForceGraph from "force-graph";
import { useEffect, useMemo, useRef } from "react";
import { useSystemViewContext } from "@contexts/SystemViewContext";
import { GraphViewModel } from "./GraphViewModel";

export const useGraph = () => {
  const {
    data,
    filteredData,
    selectedElement,
    focusedElement,
    selectedDimensions,
    depthLevel,
    showModules,
    showOperations,
    setFilteredData,
    setSelectedElement,
  } = useSystemViewContext();

  const domElementRef = useRef<any>();

  const graphViewModel = useMemo(() => new GraphViewModel(ForceGraph()), []);

  const actualData = useMemo(
    () => graphViewModel.getActualData(data!, filteredData!),
    [graphViewModel, data, filteredData]
  );

  const clickedNode = useMemo(
    () => graphViewModel.getClickedNode(selectedElement!),
    [graphViewModel, selectedElement]
  );

  const focusedNode = useMemo(
    () => graphViewModel.getFocusedNode(focusedElement!),
    [graphViewModel, focusedElement]
  );

  useEffect(
    () => graphViewModel.resetGraphFiltering(setFilteredData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [graphViewModel, selectedDimensions, showModules, showOperations]
  );

  useEffect(
    () => graphViewModel.onNodeFocusRequest(focusedNode),
    [graphViewModel, focusedNode]
  );

  useEffect(
    () =>
      graphViewModel.setNodeClickHandlerOnGraph(
        selectedElement!,
        setSelectedElement
      ),
    [graphViewModel, selectedElement, setSelectedElement]
  );

  useEffect(() => {
    graphViewModel.diminishNodesAndLinks();
    graphViewModel.handleGraphFiltering(
      clickedNode,
      depthLevel!,
      showModules || false,
      actualData!
    );
  }, [graphViewModel, clickedNode, depthLevel, showModules, actualData]);

  useEffect(
    () => graphViewModel.configureGraph(domElementRef?.current),
    [graphViewModel]
  );

  useEffect(() => {
    graphViewModel.setGraphData(actualData);
    graphViewModel.centerGraph();
  }, [graphViewModel, actualData]);

  return domElementRef;
};
