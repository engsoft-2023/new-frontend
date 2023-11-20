import { useEffect, useState } from "react";
import { useSystemViewContext } from "@contexts/SystemViewContext";
import { SystemService } from "@services/system";
import { System } from "@common/system";

const useSystem = (id: any) => {
  const [loading, setLoading] = useState(true);
  const [system, setSystem] = useState({});
  const [metrics, setMetrics] = useState({});
  const { setAllCombinationsOfData } = useSystemViewContext();

  useEffect(() => {
    if (!id) return;

    SystemService.getSystemById(id)
      .then((sys) => {
        setSystem(sys);
        setAllCombinationsOfData(sys as System);
        return SystemService.getSystemMetrics(id);
      })
      .then((metrics) => setMetrics(metrics))
      .finally(() => setLoading(false));
  }, [id]);

  return { loading, system, metrics };
};

export default useSystem;
