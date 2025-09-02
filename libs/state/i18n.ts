import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";
import cs from "../../locales/cs.json";
import en from "../../locales/en.json";

export const languages = {
  en: { translation: en },
  cs: { translation: cs },
};

const fallback = "en";
const { languageTag } =
  RNLocalize
    .findBestAvailableLanguage(Object.keys(languages)) || { languageTag: fallback };

i18n
  .use(initReactI18next)
  .init({
    lng: languageTag,
    fallbackLng: fallback,
    resources: languages,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;