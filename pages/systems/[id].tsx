import { SystemViewProvider } from "@contexts/SystemViewContext";
import SystemView from "@views/SystemView";

const SystemPage = () => (
  <SystemViewProvider>
    <SystemView />
  </SystemViewProvider>
);

export default SystemPage;
