import { fireEvent, render, screen } from "@testing-library/react";
import { Dimension } from "@common/dimension";
import { DimensionsSelector } from "./DimensionsSelector";
import { useSystemViewContext } from "@contexts/SystemViewContext";

jest.mock("@contexts/SystemViewContext/hook");

describe("DimensionsSelector", () => {
  beforeEach(() => {
    (useSystemViewContext as jest.Mock).mockReturnValue({
      selectedDimensions: [Dimension.DATA_COUPLING],
      setSelectedDimensions: jest.fn((_: Dimension[]) => {}),
    });
  });

  it("should keep the dimensions ordered when selecting multiple dimensions", () => {
    const { setSelectedDimensions } = useSystemViewContext();

    render(<DimensionsSelector />);

    fireEvent.click(screen.getByText("Size"));

    expect(setSelectedDimensions).toHaveBeenCalledWith([
      Dimension.SIZE,
      Dimension.DATA_COUPLING,
    ]);
  });
});
