import { Fragment } from "react";
import { DisplayMetrics } from "@components/DisplayMetrics";
import { CharM } from "@common/metrics";
import { useMetrics } from "./hook";
import { Metrics, MetricsType, Title } from "./styled";

interface Props {
  charM: CharM;
}

export const MetricsWrapper = ({ charM }: Props) => {
  const {
    globalMetrics,
    selectedElement,
    selectedElementMetrics,
    isElementSelected,
    onMetricClick,
  } = useMetrics(charM);

  return (
    <Metrics>
      <Title>Metrics</Title>
      <MetricsType>Global:</MetricsType>
      <DisplayMetrics metrics={globalMetrics} onMetricClick={onMetricClick} />
      {isElementSelected && (
        <Fragment>
          <MetricsType>
            Metrics of the {selectedElement?.type} {selectedElement?.name}:
          </MetricsType>
          <DisplayMetrics metrics={selectedElementMetrics} />
        </Fragment>
      )}
    </Metrics>
  );
};
