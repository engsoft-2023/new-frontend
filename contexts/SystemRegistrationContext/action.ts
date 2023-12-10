import { SystemActions } from "./types";

export interface SystemAction {
  type: SystemActions;
  payload: any;
}

export const setSystemNameAction = (name: string): SystemAction => ({
  type: SystemActions.SET_NAME,
  payload: { name },
});

export const setRepositoryUrlAction = (
  repositoryUrl: string
): SystemAction => ({
  type: SystemActions.SET_REPOSITORY_URL,
  payload: { repositoryUrl },
});

export const setDockerComposeFilenameAction = (
  dockerComposeFilename: string
): SystemAction => ({
  type: SystemActions.SET_DOCKER_COMPOSE_FILENAME,
  payload: { dockerComposeFilename },
});

export const setServiceToOpenApiFilenameAction = (
  serviceName: string,
  openApiFilename: string
): SystemAction => ({
  type: SystemActions.SET_SERVICE_TO_OPEN_API_FILENAME,
  payload: { serviceName, openApiFilename },
});

export const setServiceToSyncAndAsyncOperationsAction = (
  serviceName: string,
  syncAndAsyncOperations: {}
): SystemAction => ({
  type: SystemActions.SET_SERVICE_TO_SYNC_AND_ASYNC_OPERATIONS,
  payload: { serviceName, syncAndAsyncOperations },
});


export const nextRegistrationStepAction = (): SystemAction => ({
  type: SystemActions.NEXT_REGISTRATION_STEP,
  payload: {},
});
