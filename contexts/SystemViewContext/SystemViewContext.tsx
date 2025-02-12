import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useMemo,
  useReducer,
} from "react";
import { SystemViewAction } from "./actions";
import { systemViewReducer } from "./reducer";
import { SystemViewState } from "./types";

const initialState: SystemViewState = {
  selectedDimensions: [],
  allCombinationsOfData: {},
  data: { nodes: [], links: [] },
  filteredData: { nodes: [], links: [] },
  showModules: false,
  showOperations: false,
  depthLevel: 1,
  selectedElement: { id: "", type: "service", name: "" },
  focusedElement: { id: "", type: "service", name: "" },
};

export const SystemViewContext = createContext<{
  state: SystemViewState;
  dispatch: Dispatch<SystemViewAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const SystemViewProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(systemViewReducer, initialState);
  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <SystemViewContext.Provider value={contextValue}>
      {children}
    </SystemViewContext.Provider>
  );
};
