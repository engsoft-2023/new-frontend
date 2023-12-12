import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useMemo,
  useReducer,
} from "react";
import { SystemAction, SystemState } from "./types";
import { registerSystemReducer } from "./reducer";

const initialState: SystemState = {
  name: "",
  repositoryUrl: "",
  dockerComposeFilename: "",
  serviceToOpenApiFilename: {},
  serviceToSynAndAsyncOperations: {},
  registrationStep: 0,
};

export const SystemRegistrationContext = createContext<{
  state: SystemState;
  dispatch: Dispatch<SystemAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const SystemRegistrationProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(registerSystemReducer, initialState);
  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <SystemRegistrationContext.Provider value={contextValue}>
      {children}
    </SystemRegistrationContext.Provider>
  );
};
