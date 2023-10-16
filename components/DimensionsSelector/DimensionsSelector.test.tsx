import { fireEvent, render, screen } from "@testing-library/react";
import { Dimension } from "@common/dimension";
import { DimensionsSelector } from "./DimensionsSelector";

describe("DimensionsSelector", () => {
  it("should keep the dimensions ordered when selecting multiple dimensions", () => {
    const selectedDimensions = [Dimension.DATA_COUPLING];
    const setSelectedDimensions = jest.fn((_: Dimension[]) => {});

    render(
      <DimensionsSelector
        dimensions={selectedDimensions}
        onDimensionsChange={setSelectedDimensions}
      />
    );

    fireEvent.click(screen.getByText("Size"));

    expect(setSelectedDimensions).toHaveBeenCalledWith([
      Dimension.SIZE,
      Dimension.DATA_COUPLING,
    ]);
  });
});
