import { Fragment } from "react";
import useMetrics from "@hooks/useMetrics";
import DisplayMetrics from "@components/DisplayMetrics";
import { Metrics, MetricsType, Title } from "./styled";

const MetricsWrapper = ({ metrics, selectedComponent, onMetricClick }: any) => {
  const { globals, specificsByComponent } = useMetrics(
    metrics,
    selectedComponent
  );

  return (
    <Metrics>
      <Title>Metrics</Title>
      <MetricsType>Global:</MetricsType>
      <DisplayMetrics metrics={globals} onMetricClick={onMetricClick} />
      <Fragment>
        <MetricsType>
          Metrics of the {specificsByComponent.type} {specificsByComponent.name}
          :
        </MetricsType>
        <DisplayMetrics metrics={specificsByComponent.metrics} />
      </Fragment>
    </Metrics>
  );
};

export default MetricsWrapper;
