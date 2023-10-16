import React from "react";
import { Checkbox } from "@components/Checkbox";
import { useDimensionsSelector } from "./hook";
import { DimensionsSelectorParams } from "./types";
import { SelectorWrapper } from "./styled";

export const DimensionsSelector = (params: DimensionsSelectorParams) => {
  const { allDimensions, isDimensionSelected, onDimensionSelect } =
    useDimensionsSelector(params);

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
