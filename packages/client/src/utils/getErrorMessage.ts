import { AxiosError } from "axios";
import { APIError } from "../types/apiResponses";

/**
 * Type guard to check if an error is an Axios error
 */
function isAxiosError(err: unknown): err is AxiosError<APIError> {
  return (
    typeof err === "object" &&
    err !== null &&
    "isAxiosError" in err &&
    (err as AxiosError).isAxiosError === true
  );
}

/**
 * Extracts error message from various error types.
 * Handles Axios errors, standard Error objects, and unknown errors.
 */
export function getErrorMessage(err: unknown): string {
  // Handle Axios errors with API response
  if (isAxiosError(err)) {
    if (err.response?.data?.message) {
      return err.response.data.message;
    }
    return err.message || "An error occurred";
  }

  // Handle standard Error objects
  if (err instanceof Error) {
    return err.message;
  }

  // Handle string errors
  if (typeof err === "string") {
    return err;
  }

  return "An error occurred";
}
