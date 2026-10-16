export type LoginLocale = "en-US" | "es-ES";

export interface LoginTranslation {
  title: string;
  description: string;
  login: string;
  googleLogin: string;
  language: string;
}

export const loginTranslations: Record<LoginLocale, LoginTranslation> = {
  "en-US": {
    title: "Requirements prioritization",
    description: "An app for prioritizing the Tech Centre's requirements.",
    login: "Log In",
    googleLogin: "Continue with Google",
    language: "English (United States)",
  },
  "es-ES": {
    title: "Priorización de Requerimientos",
    description:
      "Una aplicación para priorizar los requerimientos del Centro Tecnológico",
    login: "Iniciar sesión",
    googleLogin: "Continuar con Google",
    language: "Español (España)",
  },
};
