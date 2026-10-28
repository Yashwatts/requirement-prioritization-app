import { AxiosError } from "axios";

export function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as Record<string, unknown>;

    if (typeof data.detail === "string" && data.detail.trim().length > 0) {
      return data.detail;
    }

    if (Array.isArray(data.invalid_params) && data.invalid_params.length > 0) {
      return data.invalid_params
        .map((param: Record<string, unknown>) => {
          const name = param.name ? `${param.name}: ` : "";
          const reason =
            typeof param.reason === "string"
              ? param.reason
              : typeof param.message === "string"
                ? param.message
                : JSON.stringify(param);
          return `${name}${reason}`;
        })
        .join("; ");
    }

    if (typeof data.title === "string" && data.title.trim().length > 0) {
      return data.title;
    }

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
