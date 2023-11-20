import { ApiError } from "@common/api";
import { System } from "@common/system";
import { api } from "@services/axios";
import { AxiosError, AxiosResponse } from "axios";

export class SystemService {
  public static async getAllSystems() {
    return this.handleRequest<System[]>(() => api.get("/systems"));
  }

  public static async getSystemById(id: string) {
    return this.handleRequest<System>(() => api.get(`/systems/${id}`));
  }

  public static async getSystemMetrics(id: string) {
    return this.handleRequest(() => api.get(`/systems/${id}/metrics`));
  }

  public static async registerNewSystem(repoUrl: string, filename: string) {
    return this.handleRequest<System>(() =>
      api.post("/systems", {
        repoUrl,
        filename,
      })
    );
  }

  public static async registerSystemEndpoints(
    repoUrl: string,
    systemName: string,
    servicesAndOpenApiFilenames: any
  ) {
    return this.handleRequest<string>(() =>
      api.put(`/systems/${systemName}/endpoints`, {
        repoUrl,
        servicesAndOpenApiFilenames,
      })
    );
  }

  private static async handleRequest<T>(
    requestFunction: () => Promise<AxiosResponse<T | ApiError>>
  ): Promise<T | ApiError> {
    try {
      const response = await requestFunction();
      return this.isSucessful(response)
        ? (response.data as T)
        : (response.data as ApiError);
    } catch (error) {
      return (error as AxiosError).response?.data as ApiError;
    }
  }

  private static isSucessful(response: AxiosResponse) {
    return response.status >= 200 && response.status < 300;
  }
}
