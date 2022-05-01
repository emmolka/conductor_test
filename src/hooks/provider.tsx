/* eslint-disable indent */ // strange local eslint bug
import React from "react";
import { Language } from "../types";

const langData = {
  "en-US": {
    welcome: "Log in to see magic",
  },
  "pl-PL": {
    welcome: "Zaloguj sie by zobaczyc magie",
  },
};

export const LangContext = React.createContext<{
  lang: Language;
  currentLangData: {
    [k: string]: string;
  };
  switchLang: (language: Language) => void;
}>({
  lang: "en-US",
  currentLangData: langData["en-US"],
  switchLang: () => ({}),
});

export function LangProvider(props: {
  children: React.ReactElement;
}): JSX.Element {
  const [lang, setLang] = React.useState<Language>("en-US");

  const switchLang = (language: Language) => {
    setLang(language);
  };

  return (
    <LangContext.Provider
      value={{
        lang,
        switchLang,
        currentLangData: langData[lang],
      }}
    >
      {props.children}
    </LangContext.Provider>
  );
}
