/* eslint-disable indent */ // strange local eslint bug
import React from "react";

const langData = {
  "en-US": {
    welcome: "Log in to see magic",
  },
  "pl-PL": {
    welcome: "Zaloguj sie by zobaczyc magie",
  },
};

export const LangContext = React.createContext<{
  lang: "en-US" | "pl-PL";
  currentLangData: {
    [k: string]: string;
  };
  switchLang: (language: "en-US" | "pl-PL") => void;
}>({
  lang: "en-US",
  currentLangData: langData["en-US"],
  switchLang: () => ({}),
});

export function LangProvider(props: {
  children: React.ReactElement;
}): JSX.Element {
  const [lang, setLang] = React.useState<"en-US" | "pl-PL">("en-US");

  const switchLang = (language: "en-US" | "pl-PL") => {
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
