import { useState } from "react";
import { registerNewSystem } from "@services/system_service";
import { useSystemRegistrationContext } from "@contexts/SystemRegistrationContext";

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

  const registerSystem = () => {
    setLoading(true);
    registerNewSystem(repositoryUrl, dockerComposeFilename)
      .then((response) => {
        setLoading(false);

        if (response.status === 201) {
          setSystemName(response.data.name);
          response.data.services.forEach(({ name }) =>
            setServiceToOpenApiFilename(name, "")
          );
          nextRegistrationStep();
        } else {
          showMessage(response.data.error || "");
        }
      })
      .catch((error) => {
        setLoading(false);
        showMessage(error.response.data.error);
      });
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
