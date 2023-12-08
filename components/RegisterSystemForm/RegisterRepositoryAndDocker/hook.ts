import { useState } from "react";
import { SystemService } from "@services/system";
import { useSystemRegistrationContext } from "@contexts/SystemRegistrationContext";
import { ApiError, isApiError } from "@common/api";
import { System } from "@common/system";

export const useRegisterRepositoryAndDocker = () => {
  const [loading, setLoading] = useState(false);
  const {
    repositoryUrl,
    dockerComposeFilename,
    setSystemName,
    setRepositoryUrl,
    setDockerComposeFilename,
    setServiceToOpenApiFilename,
    nextRegistrationStep,
  } = useSystemRegistrationContext();

  const showMessage = (message: string) => {
    message !== "" && alert(message);
  };

  const registerSystem = async () => {
    setLoading(true);
    const response = await SystemService.registerNewSystem(
      repositoryUrl,
      dockerComposeFilename
    );
    setLoading(false);

    if (isApiError(response)) {
      showMessage((response as ApiError).error);
    } else {
      const system = response as System;
      setSystemName(system.name);
      system.services.forEach(({ name }) =>
        setServiceToOpenApiFilename(name, "")
      );
      nextRegistrationStep();
    }
  };

  return {
    loading,
    repositoryUrl,
    dockerComposeFilename,
    setRepositoryUrl,
    setDockerComposeFilename,
    registerSystem,
  };
};
