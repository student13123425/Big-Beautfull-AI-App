export interface TabTexts {
  browse: string;
  sinteza: string;
  quiz: string;
}

const supportedLanguages = [
  "English",
  "Mandarin Chinese",
  "Romanian",
  "Spanish",
  "Modern Standard Arabic",
  "French",
  "Russian",
  "German",
  "Japanese",
  "Vietnamese",
  "Turkish",
] as const;

export type TabLanguage = (typeof supportedLanguages)[number];

const tabTexts: Record<TabLanguage, TabTexts> = {
  English: {
    browse: "Browse",
    sinteza: "Synthesis",
    quiz: "Quiz",
  },
  "Mandarin Chinese": {
    browse: "浏览",
    sinteza: "摘要",
    quiz: "测验",
  },
  Romanian: {
    browse: "Răsfoiește",
    sinteza: "Sinteză",
    quiz: "Quiz",
  },
  Spanish: {
    browse: "Explorar",
    sinteza: "Síntesis",
    quiz: "Cuestionario",
  },
  "Modern Standard Arabic": {
    browse: "تصفح",
    sinteza: "تلخيص",
    quiz: "اختبار",
  },
  French: {
    browse: "Parcourir",
    sinteza: "Synthèse",
    quiz: "Quiz",
  },
  Russian: {
    browse: "Обзор",
    sinteza: "Синтез",
    quiz: "Тест",
  },
  German: {
    browse: "Durchsuchen",
    sinteza: "Zusammenfassung",
    quiz: "Quiz",
  },
  Japanese: {
    browse: "閲覧",
    sinteza: "要約",
    quiz: "クイズ",
  },
  Vietnamese: {
    browse: "Duyệt",
    sinteza: "Tổng hợp",
    quiz: "Trắc nghiệm",
  },
  Turkish: {
    browse: "Gözat",
    sinteza: "Özet",
    quiz: "Test",
  },
};

export function getTabTexts(language: string): TabTexts {
  return tabTexts[language as TabLanguage] ?? tabTexts["English"];
}

export default tabTexts;