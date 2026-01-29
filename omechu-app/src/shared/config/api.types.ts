export interface ApiError {
  errorCode: string;
  reason: string;
  data?: unknown;
}

export interface ApiResponse<T> {
  resultType: "SUCCESS" | "FAIL";
  error: ApiError | null;
  success: T | null;
}
