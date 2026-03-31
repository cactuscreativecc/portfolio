import type { Locale } from "../i18n-config";

// We enumerate all dictionaries here for better linting and TypeScript support
// We also use the 'normal' import for the default locale to keep it simple
const dictionaries = {
    en: () => import("../messages/en.json").then((module) => module.default),
    pt: () => import("../messages/pt.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
    dictionaries[locale]?.() ?? dictionaries.en();
