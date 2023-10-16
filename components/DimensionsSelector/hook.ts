import { Dimension } from "@common/dimension";
import { DimensionsSelectorParams } from "./types";

export const useDimensionsSelector = ({
  dimensions,
  onDimensionsChange,
}: DimensionsSelectorParams) => {
  const allDimensions = [
    Dimension.SIZE,
    Dimension.DATA_COUPLING,
    Dimension.SYNC_COUPLING,
    Dimension.ASYNC_COUPLING,
  ];

  const isDimensionSelected = (dimension: Dimension) =>
    dimensions.some((dim) => dim === dimension);

  const onDimensionSelect = (dimension: Dimension) => {
    const newSelectedDimensions = dimensions.includes(dimension)
      ? dimensions.filter((dim) => dim != dimension)
      : allDimensions.filter(
          (dim) => isDimensionSelected(dim) || dim === dimension
        );

    onDimensionsChange(newSelectedDimensions);
  };

  return {
    allDimensions,
    isDimensionSelected,
    onDimensionSelect,
  };
};
