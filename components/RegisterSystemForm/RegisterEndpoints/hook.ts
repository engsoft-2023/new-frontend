import { useState } from "react";
import { SystemService } from "@services/system";
import { useRouter } from "next/router";
import { useSystemRegistrationContext } from "@contexts/SystemRegistrationContext";
import { ApiError, isApiError } from "@common/api";

export const useRegisterEndpoints = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    name,
    repositoryUrl,
    serviceToOpenApiFilename,
    setServiceToOpenApiFilename,
    nextRegistrationStep,
    setServiceToSynAndAsyncOperations,
  } = useSystemRegistrationContext();

  const showMessage = (message: string) => {
    message !== "" && alert(message);
  };

  const registerEndpoints = async () => {
    setLoading(true);

    const data = Object.entries(serviceToOpenApiFilename).map(
      ([serviceName, openApiFilename]) => ({
        serviceName,
        openApiFilename: openApiFilename.trim(),
      })
    );
    const response = await SystemService.registerSystemEndpoints(
      repositoryUrl,
      name,
      data
    );

    setLoading(false);

    if (isApiError(response)) {
      showMessage((response as ApiError).error);
    } else {
      Object.keys(serviceToOpenApiFilename).forEach((service: string) => {
        setServiceToSynAndAsyncOperations(service, {
          synchronous: {},
          asynchronous: {},
        });
      });
      nextRegistrationStep();
    }
  };

  return {
    loading,
    serviceToOpenApiFilename,
    setServiceToOpenApiFilename,
    registerEndpoints,
  };
};
