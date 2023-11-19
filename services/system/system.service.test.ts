import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "@common/api";
import { System } from "@common/system";
import { api } from "@services/axios";
import { SystemService } from "./system.service";

describe(SystemService, () => {
  it("should get all systems", async () => {
    jest.spyOn(api, "get").mockResolvedValue({
      status: 200,
      data: [{ id: "1", name: "foo" }],
    } as AxiosResponse<System[]>);

    const response = await SystemService.getAllSystems();
    const systems = response as System[];

    expect(systems.length).toBe(1);
    expect(systems[0].id).toBe("1");
    expect(systems[0].name).toBe("foo");
  });

  it("should get system by id", async () => {
    jest.spyOn(api, "get").mockResolvedValue({
      status: 200,
      data: { id: "1", name: "foo" },
    } as AxiosResponse<System>);

    const response = await SystemService.getSystemById("1");
    const systems = response as System;

    expect(systems.id).toBe("1");
    expect(systems.name).toBe("foo");
  });

  it("should get system metrics", async () => {
    jest.spyOn(api, "get").mockResolvedValue({
      status: 200,
      data: {
        Size: {},
        "Data coupling": {},
        "Sync coupling": {},
        "Async coupling": {},
      },
    } as AxiosResponse);

    const metrics = await SystemService.getSystemMetrics("1");

    expect(metrics).toMatchObject({
      Size: {},
      "Data coupling": {},
      "Sync coupling": {},
      "Async coupling": {},
    });
  });

  it("should register a new system", async () => {
    jest.spyOn(api, "post").mockResolvedValue({
      status: 201,
      data: { id: "1", name: "foo" },
    } as AxiosResponse<System>);

    const response = await SystemService.registerNewSystem(
      "repoUrl",
      "dockerfilename"
    );
    const systems = response as System;

    expect(systems.id).toBe("1");
    expect(systems.name).toBe("foo");
  });

  it("should return an ApiError when request status represents an error", async () => {
    jest.spyOn(api, "post").mockResolvedValue({
      status: 404,
      data: { status: 404, message: "error", error: "Not found" },
    } as AxiosResponse<ApiError>);

    const response = await SystemService.registerNewSystem(
      "repoUrl",
      "dockerfilename"
    );
    const apiError = response as ApiError;

    expect(apiError.status).toBe(404);
    expect(apiError.message).toBe("error");
    expect(apiError.error).toBe("Not found");
  });

  it("should return an ApiError when exception occurs", async () => {
    jest.spyOn(api, "post").mockImplementation(() =>
      Promise.reject({
        response: {
          data: { status: 404, message: "error", error: "Not found" },
        },
      } as AxiosError)
    );

    const response = await SystemService.registerNewSystem(
      "repoUrl",
      "dockerfilename"
    );
    const apiError = response as ApiError;

    expect(apiError.status).toBe(404);
    expect(apiError.message).toBe("error");
    expect(apiError.error).toBe("Not found");
  });

  it("should register system endpoints", async () => {
    jest.spyOn(api, "put").mockResolvedValue({
      status: 200,
      data: "",
    });

    const response = await SystemService.registerSystemEndpoints(
      "repoUrl",
      "mySystem",
      [{ "foo-service": "bar.yaml" }]
    );

    expect(response).toBe("");
  });
});
