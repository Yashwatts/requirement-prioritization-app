import { translate } from "@/localize";

export const getFirebaseAuthErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String((error as { code: unknown }).code);
    const errorMessage =
      "message" in error && typeof error.message === "string"
        ? error.message
        : "";

    if (errorMessage.toLowerCase().includes("unauthorized domain")) {
      return translate("authUnauthorizedDomain");
    }

    switch (code) {
      case "auth/popup-closed-by-user":
        return translate("authPopupClosed");
      case "auth/popup-blocked":
        return translate("authPopupBlocked");
      case "auth/cancelled-popup-request":
        return translate("authCancelledPopupRequest");
      case "auth/network-request-failed":
        return translate("authNetworkError");
      case "auth/user-disabled":
        return translate("authUserDisabled");
      case "auth/account-exists-with-different-credential":
        return translate("authUnexpectedError");
      case "auth/operation-not-allowed":
        return translate("authUnexpectedError");
      case "auth/unauthorized-domain":
        return translate("authUnauthorizedDomain");
      case "auth/invalid-api-key":
        return translate("authUnexpectedError");
      default:
        if (errorMessage) {
          return errorMessage;
        }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return translate("authUnexpectedError");
};

export const isFirebaseAuthCancellation = (error: unknown): boolean => {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String((error as { code: unknown }).code);
    return (
      code === "auth/popup-closed-by-user" ||
      code === "auth/cancelled-popup-request"
    );
  }
  return false;
};
