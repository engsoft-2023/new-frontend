import React from "react";
import { Checkbox } from "@components/Checkbox";
import { useDimensionsSelector } from "./hook";
import { SelectorWrapper } from "./styled";
import { useSystemViewContext } from "@contexts/SystemViewContext";

export const DimensionsSelector = () => {
  const { selectedDimensions, setSelectedDimensions } = useSystemViewContext();
  const { allDimensions, isDimensionSelected, onDimensionSelect } =
    useDimensionsSelector({
      dimensions: selectedDimensions!,
      onDimensionsChange: setSelectedDimensions,
    });

  return (
    <SelectorWrapper>
      Dimensions:
      {allDimensions.map((dimension) => (
        <Checkbox
          key={dimension}
          name={dimension}
          checked={isDimensionSelected(dimension)}
          onChange={() => onDimensionSelect(dimension)}
        />
      ))}
    </SelectorWrapper>
  );
};
