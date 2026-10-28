"use client";

import { useSyncExternalStore } from "react";
import enUS from "./en_US.json";
import esES from "./es_ES.json";

export type Locale = "en-US" | "es-ES";
export type TranslationKey = keyof typeof enUS;
export type Translations = typeof enUS;

export const translations: Record<Locale, Translations> = {
  "en-US": enUS,
  "es-ES": esES,
};

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export const getLocale = (): Locale => {
  if (typeof window === "undefined") {
    return "es-ES";
  }

  const savedLocale = window.localStorage.getItem("app_locale");
  if (savedLocale === "en-US") {
    return "en-US";
  }
  if (savedLocale === "es-ES") {
    return "es-ES";
  }

  return "es-ES";
};

export const setLocale = (nextLocale: Locale): void => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("app_locale", nextLocale);
  }
  emitChange();
};

export const subscribeLocale = (callback: () => void): (() => void) => {
  listeners.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
    }
  };
};

export const translate = (key: TranslationKey, locale?: Locale): string => {
  const currentLocale =
    locale ?? (typeof window !== "undefined" ? getLocale() : "es-ES");
  const dictionary = translations[currentLocale] ?? translations["es-ES"];
  return dictionary[key] ?? key;
};

export const useLocalization = () => {
  const locale = useSyncExternalStore(
    subscribeLocale,
    getLocale,
    () => "es-ES" as Locale,
  );

  return {
    locale,
    setLocale,
    translate: (key: TranslationKey) => translate(key, locale),
    translations: translations[locale],
  };
};
