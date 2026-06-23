export interface SintezaGenerationText {
  htmlNotGenerated: string;
  generateHtmlButton: string;
  generatingState: string;
  synthesisNotGenerated: string;
  generateSynthesisButton: string;
  noSynthesisLabel: string;
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

export type SintezaGenerationLanguage = (typeof supportedLanguages)[number];

const sintezaGenerationTexts: Record<SintezaGenerationLanguage, SintezaGenerationText> = {
  English: {
    htmlNotGenerated: "HTML version for this file hasn't been generated yet",
    generateHtmlButton: "Generate HTML",
    generatingState: "Generating...",
    synthesisNotGenerated: "Synthesis for this file hasn't been generated yet",
    generateSynthesisButton: "Generate Synthesis",
    noSynthesisLabel: "No synthesis",
  },
  "Mandarin Chinese": {
    htmlNotGenerated: "此文件的HTML版本尚未生成",
    generateHtmlButton: "生成HTML",
    generatingState: "生成中...",
    synthesisNotGenerated: "此文件的摘要尚未生成",
    generateSynthesisButton: "生成摘要",
    noSynthesisLabel: "无摘要",
  },
  Romanian: {
    htmlNotGenerated: "Versiunea HTML pentru acest fișier nu a fost încă generată",
    generateHtmlButton: "Generează HTML",
    generatingState: "Se generează...",
    synthesisNotGenerated: "Sinteza pentru acest fișier nu a fost încă generată",
    generateSynthesisButton: "Generează Sinteza",
    noSynthesisLabel: "Fără sinteză",
  },
  Spanish: {
    htmlNotGenerated: "La versión HTML de este archivo aún no se ha generado",
    generateHtmlButton: "Generar HTML",
    generatingState: "Generando...",
    synthesisNotGenerated: "La síntesis de este archivo aún no se ha generado",
    generateSynthesisButton: "Generar Síntesis",
    noSynthesisLabel: "Sin síntesis",
  },
  "Modern Standard Arabic": {
    htmlNotGenerated: "لم يتم إنشاء نسخة HTML لهذا الملف بعد",
    generateHtmlButton: "إنشاء HTML",
    generatingState: "جاري الإنشاء...",
    synthesisNotGenerated: "لم يتم إنشاء ملخص لهذا الملف بعد",
    generateSynthesisButton: "إنشاء الملخص",
    noSynthesisLabel: "لا يوجد ملخص",
  },
  French: {
    htmlNotGenerated: "La version HTML de ce fichier n'a pas encore été générée",
    generateHtmlButton: "Générer le HTML",
    generatingState: "Génération en cours...",
    synthesisNotGenerated: "La synthèse de ce fichier n'a pas encore été générée",
    generateSynthesisButton: "Générer la Synthèse",
    noSynthesisLabel: "Pas de synthèse",
  },
  Russian: {
    htmlNotGenerated: "HTML-версия для этого файла еще не создана",
    generateHtmlButton: "Создать HTML",
    generatingState: "Генерация...",
    synthesisNotGenerated: "Синтез для этого файла еще не создан",
    generateSynthesisButton: "Создать Синтез",
    noSynthesisLabel: "Нет синтеза",
  },
  German: {
    htmlNotGenerated: "HTML-Version für diese Datei wurde noch nicht generiert",
    generateHtmlButton: "HTML Generieren",
    generatingState: "Generierung läuft...",
    synthesisNotGenerated: "Zusammenfassung für diese Datei wurde noch nicht generiert",
    generateSynthesisButton: "Zusammenfassung Generieren",
    noSynthesisLabel: "Keine Zusammenfassung",
  },
  Japanese: {
    htmlNotGenerated: "このファイルのHTMLバージョンはまだ生成されていません",
    generateHtmlButton: "HTMLを生成",
    generatingState: "生成中...",
    synthesisNotGenerated: "このファイルの要約はまだ生成されていません",
    generateSynthesisButton: "要約を生成",
    noSynthesisLabel: "要約なし",
  },
  Vietnamese: {
    htmlNotGenerated: "Phiên bản HTML của tệp này chưa được tạo",
    generateHtmlButton: "Tạo HTML",
    generatingState: "Đang tạo...",
    synthesisNotGenerated: "Tổng hợp cho tệp này chưa được tạo",
    generateSynthesisButton: "Tạo Tổng Hợp",
    noSynthesisLabel: "Không có tổng hợp",
  },
  Turkish: {
    htmlNotGenerated: "Bu dosyanın HTML sürümü henüz oluşturulmadı",
    generateHtmlButton: "HTML Oluştur",
    generatingState: "Oluşturuluyor...",
    synthesisNotGenerated: "Bu dosya için özet henüz oluşturulmadı",
    generateSynthesisButton: "Özet Oluştur",
    noSynthesisLabel: "Özet yok",
  },
};

export function getSintezaGenerationText(language: string): SintezaGenerationText {
  return sintezaGenerationTexts[language as SintezaGenerationLanguage] ?? sintezaGenerationTexts["English"];
}

export { supportedLanguages };

export const sintezaGenerationTextsArray: SintezaGenerationText[] = [...supportedLanguages].map(
  (lang) => sintezaGenerationTexts[lang]
);

export default sintezaGenerationTexts;