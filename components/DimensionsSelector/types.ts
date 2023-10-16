import { Dimension } from "@common/dimension";

export interface DimensionsSelectorParams {
  dimensions: Dimension[];
  onDimensionsChange: (newDimensions: Dimension[]) => void;
}
