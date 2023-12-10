export interface SystemState {
  name: string;
  repositoryUrl: string;
  dockerComposeFilename: string;
  serviceToOpenApiFilename: { [key: string]: string };
  serviceToSynAndAsyncOperations: { [key: string]: [] };
  registrationStep: number;
}

export interface SystemAction {
  type: SystemActions;
  payload: any;
}

export enum SystemActions {
  SET_NAME,
  SET_REPOSITORY_URL,
  SET_DOCKER_COMPOSE_FILENAME,
  SET_SERVICE_TO_OPEN_API_FILENAME,
  NEXT_REGISTRATION_STEP,
  SET_SERVICE_TO_SYNC_AND_ASYNC_OPERATIONS,
}
