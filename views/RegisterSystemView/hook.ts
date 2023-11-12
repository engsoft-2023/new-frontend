import {
  RegisterEndpoints,
  RegisterRepositoryAndDocker,
} from "@components/RegisterSystemForm";
import { useSystemRegistrationContext } from "@contexts/SystemRegistrationContext";

export const useRegisterSystemView = () => {
  const { registrationStep } = useSystemRegistrationContext();
  const pageTitles = ["Register new system", "Register endpoints"];
  const registrationComponents = [
    RegisterRepositoryAndDocker,
    RegisterEndpoints,
  ];

  return {
    CurrentComponent: registrationComponents[registrationStep],
    pageTitle: pageTitles[registrationStep],
  };
};
