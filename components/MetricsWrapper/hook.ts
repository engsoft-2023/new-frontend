import { Dimension } from "@common/dimension";
import { CharM, Metrics } from "@common/metrics";
import { useSystemViewContext } from "@contexts/SystemViewContext";

export const useMetrics = (charM: CharM) => {
  const { selectedElement, setFocusedElement } = useSystemViewContext();

  const changeMetricName = (metricName: string) => {
    let newName = metricName;
    const target = ["a given component", "each component"].find((op) =>
      metricName.includes(op)
    );

    if (target) newName = metricName.replaceAll(target, "it");
    else if (metricName.includes("per component"))
      newName = metricName.replaceAll("per component", "");

    return newName;
  };

  const isGlobalMetric = (metricValue: any) =>
    typeof metricValue !== "object" ||
    Object.values(metricValue).some((val) => typeof val !== "object");

  const getGlobalMetrics = (): {} => {
    const allMetrics = Object.keys(charM).reduce(
      (metrics, dimension) => [...metrics, charM[dimension as Dimension]],
      [] as Metrics[]
    );

    const globalMetrics = {} as { [key: string]: any };

    allMetrics.forEach((metrics) => {
      Object.entries(metrics).forEach(([name, value]) => {
        if (isGlobalMetric(value)) globalMetrics[name] = value;
      });
    });

    return globalMetrics;
  };

  const getSelectedElementMetrics = (): {} => {
    const allMetrics = Object.keys(charM).reduce(
      (metrics, dimension) => [...metrics, charM[dimension as Dimension]],
      [] as Metrics[]
    );

    const specificsMetrics = {} as { [key: string]: any };

    allMetrics.forEach((metrics) => {
      Object.entries(metrics).forEach(([name, value]) => {
        const newName = changeMetricName(name);

        if (!isGlobalMetric(value)) specificsMetrics[newName] = value;
      });
    });

    const { name, type } = selectedElement!;

    return Object.keys(specificsMetrics).reduce(
      (acc, metric) => ({
        ...acc,
        [metric]: specificsMetrics[metric][type + "s"][name],
      }),
      {}
    );
  };

  const onMetricClick = ({ name }: { name: string }) =>
    setFocusedElement({ name });

  const isElementSelected =
    selectedElement?.id !== "" &&
    selectedElement?.name !== "" &&
    selectedElement?.type !== undefined;

  return {
    globalMetrics: getGlobalMetrics(),
    selectedElement,
    selectedElementMetrics: getSelectedElementMetrics(),
    isElementSelected,
    onMetricClick,
  };
};
