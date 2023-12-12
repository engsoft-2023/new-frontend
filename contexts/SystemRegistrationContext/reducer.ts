import { SystemAction, SystemActions, SystemState } from "./types";

export const registerSystemReducer = (
  state: SystemState,
  { type, payload }: SystemAction
): SystemState => {
  switch (type) {
    case SystemActions.SET_NAME:
      return {
        ...state,
        name: payload.name,
      };
    case SystemActions.SET_REPOSITORY_URL:
      return {
        ...state,
        repositoryUrl: payload.repositoryUrl,
      };
    case SystemActions.SET_DOCKER_COMPOSE_FILENAME:
      return {
        ...state,
        dockerComposeFilename: payload.dockerComposeFilename,
      };
    case SystemActions.SET_SERVICE_TO_OPEN_API_FILENAME:
      return {
        ...state,
        serviceToOpenApiFilename: {
          ...state.serviceToOpenApiFilename,
          [payload.serviceName]: payload.openApiFilename,
        },
      };
    case SystemActions.NEXT_REGISTRATION_STEP:
      return {
        ...state,
        registrationStep: state.registrationStep + 1,
      };
    case SystemActions.SET_SERVICE_TO_SYNC_AND_ASYNC_OPERATIONS:
      return {
        ...state,
        serviceToSynAndAsyncOperations: {
          ...state.serviceToSynAndAsyncOperations,
          [payload.serviceName]: payload.syncAndAsyncOperations,
        },
      };
    default:
      throw new Error("type invalid");
  }
};
