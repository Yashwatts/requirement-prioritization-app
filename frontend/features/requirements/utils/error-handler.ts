import { AxiosError } from "axios";

// ============================================================
// Error Helper: RFC 9457 Problem Details & Axios Extractor
// ============================================================

export function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as Record<string, unknown>;

    // RFC 9457 detail field
    if (typeof data.detail === "string" && data.detail.trim().length > 0) {
      return data.detail;
    }

    // RFC 9457 invalid_params array
    if (Array.isArray(data.invalid_params) && data.invalid_params.length > 0) {
      return data.invalid_params
        .map((param: Record<string, unknown>) => {
          const name = param.name ? `${param.name}: ` : "";
          const reason = param.reason || param.message || JSON.stringify(param);
          return `${name}${reason}`;
        })
        .join("; ");
    }

    // RFC 9457 title field
    if (typeof data.title === "string" && data.title.trim().length > 0) {
      return data.title;
    }

    // Standard message string or string array
    if (typeof data.message === "string") {
      return data.message;
    }
    if (Array.isArray(data.message)) {
      return data.message.join(", ");
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}
