import { useState } from "react";
import { registerSystemEndpoints } from "@services/system_service";
import { useRouter } from "next/router";
import { useSystemRegistrationContext } from "@contexts/SystemRegistrationContext";

export const useRegisterEndpoints = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    name,
    repositoryUrl,
    serviceToOpenApiFilename,
    setServiceToOpenApiFilename,
  } = useSystemRegistrationContext();

  const showMessage = (message: string) => {
    message !== "" && alert(message);
  };

  const registerEndpoints = () => {
    setLoading(true);

    const data = Object.entries(serviceToOpenApiFilename).map(
      ([serviceName, openApiFilename]) => ({
        serviceName,
        openApiFilename: openApiFilename.trim(),
      })
    );

    registerSystemEndpoints(repositoryUrl, name, data)
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          showMessage("New system has been successfully registered");
          router.push(`/systems/${name}`);
        } else {
          showMessage(response.data.error);
        }
      })
      .catch((error) => {
        setLoading(false);
        showMessage(error.response.data.error);
      });
  };

  return {
    loading,
    serviceToOpenApiFilename,
    setServiceToOpenApiFilename,
    registerEndpoints,
  };
};
