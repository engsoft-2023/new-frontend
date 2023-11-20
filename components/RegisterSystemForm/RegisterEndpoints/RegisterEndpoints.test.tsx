import { useSystemRegistrationContext } from "@contexts/SystemRegistrationContext";
import { SystemService } from "@services/system";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { RegisterEndpoints } from "./RegisterEndpoints";
import { useRouter } from "next/router";

jest.mock("@contexts/SystemRegistrationContext/hook");
jest.mock("next/router");

describe(RegisterEndpoints, () => {
  beforeEach(() => {
    (useSystemRegistrationContext as jest.Mock).mockReturnValue({
      name: "system",
      repositoryUrl: "url",
      serviceToOpenApiFilename: { "user-service": "user-service-openapi.yaml" },
      setServiceToOpenApiFilename: jest.fn(),
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  it("should render inputs for each service", () => {
    render(<RegisterEndpoints />);

    expect(screen.getByTestId("user-service")).toHaveAttribute(
      "name",
      "user-service"
    );
  });

  it("should set value of each input", () => {
    const { setServiceToOpenApiFilename } = useSystemRegistrationContext();

    render(<RegisterEndpoints />);
    fireEvent.input(screen.getByTestId("user-service"), {
      target: { value: "foo.yaml" },
    });

    expect(setServiceToOpenApiFilename).toHaveBeenCalledWith(
      "user-service",
      "foo.yaml"
    );
  });

  it("should successfully register system endpoints", async () => {
    const router = useRouter();
    const { name, repositoryUrl } = useSystemRegistrationContext();
    jest.spyOn(SystemService, "registerSystemEndpoints").mockResolvedValue("");
    global.alert = jest.fn();

    render(<RegisterEndpoints />);
    act(() => fireEvent.click(screen.getByRole("button")));

    expect(SystemService.registerSystemEndpoints).toHaveBeenCalledWith(
      repositoryUrl,
      name,
      [
        {
          serviceName: "user-service",
          openApiFilename: "user-service-openapi.yaml",
        },
      ]
    );
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "New system has been successfully registered"
      );
      expect(router.push).toHaveBeenCalledWith(`/systems/${name}`);
    });
  });

  it("should show error message when registration fails", async () => {
    const router = useRouter();
    const { name, repositoryUrl } = useSystemRegistrationContext();
    jest.spyOn(SystemService, "registerSystemEndpoints").mockResolvedValue({
      status: 500,
      message: "there is something wrong",
      error: "an error occurred",
    });
    global.alert = jest.fn();

    render(<RegisterEndpoints />);
    act(() => fireEvent.click(screen.getByRole("button")));

    expect(SystemService.registerSystemEndpoints).toHaveBeenCalledWith(
      repositoryUrl,
      name,
      [
        {
          serviceName: "user-service",
          openApiFilename: "user-service-openapi.yaml",
        },
      ]
    );
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("an error occurred");
      expect(router.push).not.toHaveBeenCalled();
    });
  });

  afterAll(() => jest.clearAllMocks());
});
