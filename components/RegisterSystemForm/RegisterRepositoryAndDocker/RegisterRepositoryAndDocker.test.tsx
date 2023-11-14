import { useSystemRegistrationContext } from "@contexts/SystemRegistrationContext";
import { RegisterRepositoryAndDocker } from "./RegisterRepositoryAndDocker";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { SystemService } from "@services/system_service";

jest.mock("@contexts/SystemRegistrationContext/hook");

describe(RegisterRepositoryAndDocker, () => {
  beforeEach(() => {
    (useSystemRegistrationContext as jest.Mock).mockReturnValue({
      repositoryUrl: "myRepoUrl",
      dockerComposeFilename: "myDockerComposeFilename",
      setRepositoryUrl: jest.fn(),
      setDockerComposeFilename: jest.fn(),
      setSystemName: jest.fn(),
      setServiceToOpenApiFilename: jest.fn(),
      nextRegistrationStep: jest.fn(),
    });
  });

  it("should set values from repoUrl and dockerComposeFilename when user inputs data", () => {
    const { setRepositoryUrl, setDockerComposeFilename } =
      useSystemRegistrationContext();

    render(<RegisterRepositoryAndDocker />);
    fireEvent.input(screen.getByTestId("repository_url"), {
      target: { value: "foo" },
    });
    fireEvent.input(screen.getByTestId("docker_compose_filename"), {
      target: { value: "bar" },
    });

    expect(setRepositoryUrl).toHaveBeenCalledWith("foo");
    expect(setDockerComposeFilename).toHaveBeenCalledWith("bar");
  });

  it("should successfully register a repository and docker compose file", async () => {
    const {
      repositoryUrl,
      dockerComposeFilename,
      setSystemName,
      setServiceToOpenApiFilename,
      nextRegistrationStep,
    } = useSystemRegistrationContext();
    const system = {
      id: "1",
      name: "InterSCity",
      description: "Platform for smart cities",
      modules: [],
      services: [
        {
          id: "1",
          name: "foo",
          responsibility: "",
          moduleId: "1",
          operations: [],
        },
      ],
      databases: [],
      databasesUsages: [],
      syncOperations: [],
      asyncOperations: [],
    };
    jest.spyOn(SystemService, "registerNewSystem").mockResolvedValue(system);

    render(<RegisterRepositoryAndDocker />);
    act(() => fireEvent.click(screen.getByRole("button")));

    expect(SystemService.registerNewSystem).toHaveBeenCalledWith(
      repositoryUrl,
      dockerComposeFilename
    );
    await waitFor(() => {
      expect(setSystemName).toHaveBeenCalledWith(system.name);
      expect(nextRegistrationStep).toHaveBeenCalled();
      expect(setServiceToOpenApiFilename).toHaveBeenCalledWith(
        system.services[0].name,
        ""
      );
    });
  });

  it("should show message error when there is an api error", async () => {
    const {
      repositoryUrl,
      dockerComposeFilename,
      setSystemName,
      setServiceToOpenApiFilename,
      nextRegistrationStep,
    } = useSystemRegistrationContext();
    const apiError = {
      status: 400,
      error: "An error occurred",
      message: "There is an error",
    };
    jest.spyOn(SystemService, "registerNewSystem").mockResolvedValue(apiError);
    global.alert = jest.fn();

    render(<RegisterRepositoryAndDocker />);
    act(() => fireEvent.click(screen.getByRole("button")));

    expect(SystemService.registerNewSystem).toHaveBeenCalledWith(
      repositoryUrl,
      dockerComposeFilename
    );
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(apiError.error);
      expect(setSystemName).not.toHaveBeenCalled();
      expect(setServiceToOpenApiFilename).not.toHaveBeenCalled();
      expect(nextRegistrationStep).not.toHaveBeenCalled();
    });
  });

  afterAll(() => jest.clearAllMocks());
});
