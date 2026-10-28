export const getFirebaseAuthErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String((error as { code: unknown }).code);
    const errorMessage =
      "message" in error && typeof error.message === "string"
        ? error.message
        : "";

    if (errorMessage.toLowerCase().includes("unauthorized domain")) {
      return "This Google account is not authorized to access the application. Please use an approved account.";
    }

    switch (code) {
      case "auth/popup-closed-by-user":
        return "Sign in was cancelled (popup window was closed).";
      case "auth/popup-blocked":
        return "Sign-in popup was blocked by your browser. Please allow popups for this site.";
      case "auth/cancelled-popup-request":
        return "Sign-in request was cancelled. Only one popup can be active at a time.";
      case "auth/network-request-failed":
        return "Network connection error. Please check your internet connection.";
      case "auth/user-disabled":
        return "This user account has been disabled. Please contact support.";
      case "auth/account-exists-with-different-credential":
        return "An account already exists with the same email using a different sign-in method.";
      case "auth/operation-not-allowed":
        return "Google sign-in is not enabled in Firebase Authentication console.";
      case "auth/unauthorized-domain":
        return "This Google account is not authorized to access the application. Please use an approved account.";
      case "auth/invalid-api-key":
        return "Firebase configuration error: Invalid API key.";
      default:
        if (errorMessage) {
          return errorMessage;
        }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred during authentication. Please try again.";
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
