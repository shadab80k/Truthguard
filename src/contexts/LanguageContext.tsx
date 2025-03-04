
import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi" | "es" | "fr";

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    home: "Home",
    features: "Features",
    howItWorks: "How It Works",
    tryIt: "Try It",
    getStarted: "Get Started",
    verifyStatement: "Verify any statement instantly",
    enterStatement: "Enter a statement or news headline to fact-check...",
    checkFact: "Check Fact",
    analyzing: "Analyzing...",
    verified: "Verified",
    questionable: "Questionable",
    false: "False",
    statement: "Statement",
    reasoning: "Reasoning",
    confidenceScore: "Confidence Score",
    sources: "Sources",
    copyResults: "Copy Results",
  },
  hi: {
    home: "होम",
    features: "फीचर्स",
    howItWorks: "यह कैसे काम करता है",
    tryIt: "प्रयास करें",
    getStarted: "शुरू करें",
    verifyStatement: "किसी भी कथन को तुरंत सत्यापित करें",
    enterStatement: "तथ्य-जांच के लिए एक कथन या समाचार हेडलाइन दर्ज करें...",
    checkFact: "तथ्य जांचें",
    analyzing: "विश्लेषण कर रहा है...",
    verified: "सत्यापित",
    questionable: "संदिग्ध",
    false: "गलत",
    statement: "कथन",
    reasoning: "तर्क",
    confidenceScore: "विश्वास स्कोर",
    sources: "स्रोत",
    copyResults: "परिणाम कॉपी करें",
  },
  es: {
    home: "Inicio",
    features: "Características",
    howItWorks: "Cómo Funciona",
    tryIt: "Pruébalo",
    getStarted: "Comenzar",
    verifyStatement: "Verifica cualquier declaración al instante",
    enterStatement: "Ingresa una declaración o titular de noticia para verificar...",
    checkFact: "Verificar Hecho",
    analyzing: "Analizando...",
    verified: "Verificado",
    questionable: "Cuestionable",
    false: "Falso",
    statement: "Declaración",
    reasoning: "Razonamiento",
    confidenceScore: "Puntuación de Confianza",
    sources: "Fuentes",
    copyResults: "Copiar Resultados",
  },
  fr: {
    home: "Accueil",
    features: "Fonctionnalités",
    howItWorks: "Comment Ça Marche",
    tryIt: "Essayez",
    getStarted: "Commencer",
    verifyStatement: "Vérifiez n'importe quelle déclaration instantanément",
    enterStatement: "Entrez une déclaration ou un titre d'actualité à vérifier...",
    checkFact: "Vérifier le Fait",
    analyzing: "Analyse en cours...",
    verified: "Vérifié",
    questionable: "Discutable",
    false: "Faux",
    statement: "Déclaration",
    reasoning: "Raisonnement",
    confidenceScore: "Score de Confiance",
    sources: "Sources",
    copyResults: "Copier les Résultats",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: () => "",
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    return savedLanguage || "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string) => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
