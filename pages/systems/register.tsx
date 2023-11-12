import { SystemRegistrationProvider } from "@contexts/SystemRegistrationContext";
import RegisterSystemView from "@views/RegisterSystemView";

const RegisterSystemPage = () => (
  <SystemRegistrationProvider>
    <RegisterSystemView />
  </SystemRegistrationProvider>
);

export default RegisterSystemPage;
