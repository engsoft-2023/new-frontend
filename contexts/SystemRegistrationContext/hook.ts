import { useContext } from "react";
import { SystemRegistrationContext } from "./SystemRegistrationContext";
import {
  nextRegistrationStepAction,
  setDockerComposeFilenameAction,
  setRepositoryUrlAction,
  setServiceToOpenApiFilenameAction,
  setServiceToSyncAndAsyncOperationsAction,
  setSystemNameAction,
} from "./action";

export const useSystemRegistrationContext = () => {
  const { state, dispatch } = useContext(SystemRegistrationContext);

  const setSystemName = (name: string) => dispatch(setSystemNameAction(name));

  const setRepositoryUrl = (repositoryUrl: string) =>
    dispatch(setRepositoryUrlAction(repositoryUrl));

  const setDockerComposeFilename = (dockerComposeFilename: string) =>
    dispatch(setDockerComposeFilenameAction(dockerComposeFilename));

  const setServiceToOpenApiFilename = (
    serviceName: string,
    openApiFilename: string
  ) =>
    dispatch(setServiceToOpenApiFilenameAction(serviceName, openApiFilename));

  const setServiceToSynAndAsyncOperations = (
    serviceName: string,
    operations: {}
  ) =>
    dispatch(setServiceToSyncAndAsyncOperationsAction(serviceName, operations));

  const nextRegistrationStep = () => dispatch(nextRegistrationStepAction());

  return {
    ...state,
    setSystemName,
    setRepositoryUrl,
    setDockerComposeFilename,
    setServiceToOpenApiFilename,
    setServiceToSynAndAsyncOperations,
    nextRegistrationStep,
  };
};
