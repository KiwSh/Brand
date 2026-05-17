import { createContext, useContext, useState, useEffect } from "react";
import { TRANSLATIONS } from "../data/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    // Try to get saved language from localStorage, default to 'id'
    const saved = localStorage.getItem("rish_lang");
    return saved === "en" || saved === "id" ? saved : "id";
  });

  const setLang = (newLang) => {
    if (newLang === "en" || newLang === "id") {
      setLangState(newLang);
      localStorage.setItem("rish_lang", newLang);
    }
  };

  const t = (key) => {
    if (!key) return "";
    const dict = TRANSLATIONS[lang] || TRANSLATIONS["id"];
    return dict[key] !== undefined ? dict[key] : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
