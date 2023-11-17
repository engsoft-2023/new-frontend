import { useEffect, useState } from "react";
import { getSystemById, getSystemMetrics } from "@services/system_service";
import { useSystemViewContext } from "@contexts/SystemViewContext";

const useSystem = (id: any) => {
  const [loading, setLoading] = useState(true);
  const [system, setSystem] = useState({});
  const [metrics, setMetrics] = useState({});
  const { setAllCombinationsOfData } = useSystemViewContext();

  useEffect(() => {
    if (!id) return;

    getSystemById(id)
      .then((sys) => {
        setSystem(sys);
        setAllCombinationsOfData(sys);
        return getSystemMetrics(id);
      })
      .then((metrics) => setMetrics(metrics))
      .finally(() => setLoading(false));
  }, [id]);

  return { loading, system, metrics };
};

export default useSystem;
