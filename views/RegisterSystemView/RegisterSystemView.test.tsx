import { act, render, screen } from "@testing-library/react";
import * as RegisterHooks from "@contexts/SystemRegistrationContext/hook";
import { RegisterSystemView } from "./RegisterSystemView";

describe(RegisterSystemView, () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderPage = async () => {
    render(<RegisterSystemView />);

    await act(() => new Promise((resolve) => setTimeout(resolve, 500)));
  };

  it("should render register docker component when step is 0", async () => {
    jest.spyOn(RegisterHooks, "useSystemRegistrationContext").mockReturnValue({
      name: "",
      repositoryUrl: "",
      dockerComposeFilename: "",
      serviceToOpenApiFilename: {},
      registrationStep: 0,
      setSystemName: jest.fn(),
      setRepositoryUrl: jest.fn(),
      setDockerComposeFilename: jest.fn(),
      setServiceToOpenApiFilename: jest.fn(),
      nextRegistrationStep: jest.fn(),
    });

    await renderPage();

    expect(screen.getByRole("heading").innerHTML).toBe("Register new system");
    expect(screen.getByTestId("repository_url")).toBeTruthy();
    expect(screen.getByTestId("docker_compose_filename")).toBeTruthy();
  });

  it("should render register endpoints component when step is 1", async () => {
    jest.spyOn(RegisterHooks, "useSystemRegistrationContext").mockReturnValue({
      name: "",
      repositoryUrl: "",
      dockerComposeFilename: "",
      serviceToOpenApiFilename: {
        "user-service": "",
      },
      registrationStep: 1,
      setSystemName: jest.fn(),
      setRepositoryUrl: jest.fn(),
      setDockerComposeFilename: jest.fn(),
      setServiceToOpenApiFilename: jest.fn(),
      nextRegistrationStep: jest.fn(),
    });

    await renderPage();

    expect(screen.getByRole("heading").innerHTML).toBe("Register endpoints");
    expect(screen.getByTestId("user-service")).toBeTruthy();
  });
});
