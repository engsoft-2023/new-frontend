import {
  RegisterEndpoints,
  RegisterRepositoryAndDocker,
  RegisterSyncAndAsyncCalls,
} from "@components/RegisterSystemForm";
import { useSystemRegistrationContext } from "@contexts/SystemRegistrationContext";

export const useRegisterSystemView = () => {
  const { registrationStep } = useSystemRegistrationContext();
  const pageTitles = ["Register new system", "Register endpoints", "Register sync and async calls"];
  const registrationComponents = [
    RegisterRepositoryAndDocker,
    RegisterEndpoints,
    RegisterSyncAndAsyncCalls,
  ];

  return {
    CurrentComponent: registrationComponents[registrationStep],
    pageTitle: pageTitles[registrationStep],
  };
};
