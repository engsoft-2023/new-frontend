import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe(Button, () => {
  it("should render loading spinner when loading prop is true", () => {
    const buttonText = "My button";

    render(<Button loading>{buttonText}</Button>);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.queryByText(buttonText)).not.toBeInTheDocument();
  });

  it("should render button children when loading prop is false", () => {
    const buttonText = "My button";

    render(<Button>{buttonText}</Button>);

    expect(screen.getByText(buttonText)).toBeInTheDocument();
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
  });
});
