import { useEffect, useState } from "react";
import { useSystemViewContext } from "@contexts/SystemViewContext";
import { SystemService } from "@services/system";
import { System } from "@common/system";
import { CharM } from "@common/metrics";

export const useSystem = (id: string) => {
  const [loading, setLoading] = useState(true);
  const [system, setSystem] = useState<System>({} as System);
  const [metrics, setMetrics] = useState<CharM>({} as CharM);
  const { setAllCombinationsOfData } = useSystemViewContext();

  useEffect(() => {
    if (!id) return;

    SystemService.getSystemById(id)
      .then((sys) => {
        setSystem(sys as System);
        setAllCombinationsOfData(sys as System);
        return SystemService.getSystemMetrics(id);
      })
      .then((metrics) => setMetrics(metrics as CharM))
      .finally(() => setLoading(false));
  }, [id]);

  return { loading, system, metrics };
};
