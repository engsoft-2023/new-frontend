export interface ApiError {
  status: number;
  message: string;
  error: string;
  [key: string]: any;
}

export const isApiError = (obj: any) =>
  obj instanceof Object &&
  (("status" in obj && "message" in obj && "error" in obj) || "error" in obj);
