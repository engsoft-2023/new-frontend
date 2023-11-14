import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "@common/api";
import { System } from "@common/system";
import { api } from "./axios";

export class SystemService {
  public static async registerNewSystem(repoUrl: string, filename: string) {
    try {
      const response = await api.post<System | ApiError>("/systems", {
        repoUrl,
        filename,
      });
      return this.isSucessful(response)
        ? (response.data as System)
        : (response.data as ApiError);
    } catch (error) {
      return (error as AxiosError).response?.data as ApiError;
    }
  }

  public static async registerSystemEndpoints(
    repoUrl: string,
    systemName: string,
    servicesAndOpenApiFilenames: any
  ) {
    try {
      const response = await api.put(`/systems/${systemName}/endpoints`, {
        repoUrl,
        servicesAndOpenApiFilenames,
      });
      return this.isSucessful(response)
        ? response.data
        : (response.data as ApiError);
    } catch (error) {
      return (error as AxiosError).response?.data as ApiError;
    }
  }

  private static isSucessful(response: AxiosResponse) {
    return response.status >= 200 && response.status < 300;
  }
}

export const getAllSystems = async () => (await api.get("/systems")).data;
export const getSystemById = async (id: string) =>
  (await api.get(`/systems/${id}`)).data;
export const getSystemMetrics = async (id: string) =>
  (await api.get(`/systems/${id}/metrics`)).data;
