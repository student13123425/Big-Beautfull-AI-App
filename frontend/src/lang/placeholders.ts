export interface PlaceholderText {
  noSubjectSelected: string;
  noFileSelected: string;
  noSintezaSelected: string;
  noQuizSelected: string;
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

export type PlaceholderLanguage = (typeof supportedLanguages)[number];

const placeholderTexts: Record<PlaceholderLanguage, PlaceholderText> = {
  English: {
    noSubjectSelected: "No subject is selected",
    noFileSelected: "No file selected",
    noSintezaSelected: "No synthesis generated",
    noQuizSelected: "No quiz selected",
  },
  "Mandarin Chinese": {
    noSubjectSelected: "未选择科目",
    noFileSelected: "未选择文件",
    noSintezaSelected: "未生成摘要",
    noQuizSelected: "未选择测验",
  },
  Romanian: {
    noSubjectSelected: "Nici o materie nu este selectata",
    noFileSelected: "Niciun fisier selectat",
    noSintezaSelected: "Nicio sinteza generata",
    noQuizSelected: "Nici un quiz selectat",
  },
  Spanish: {
    noSubjectSelected: "No hay ninguna materia seleccionada",
    noFileSelected: "Ningún archivo seleccionado",
    noSintezaSelected: "Ninguna síntesis generada",
    noQuizSelected: "Ningún quiz seleccionado",
  },
  "Modern Standard Arabic": {
    noSubjectSelected: "لم يتم تحديد أي مادة",
    noFileSelected: "لم يتم تحديد ملف",
    noSintezaSelected: "لم يتم إنشاء ملخص",
    noQuizSelected: "لم يتم تحديد اختبار",
  },
  French: {
    noSubjectSelected: "Aucune matière n'est sélectionnée",
    noFileSelected: "Aucun fichier sélectionné",
    noSintezaSelected: "Aucune synthèse générée",
    noQuizSelected: "Aucun quiz sélectionné",
  },
  Russian: {
    noSubjectSelected: "Ни один предмет не выбран",
    noFileSelected: "Файл не выбран",
    noSintezaSelected: "Синтез не создан",
    noQuizSelected: "Тест не выбран",
  },
  German: {
    noSubjectSelected: "Kein Fach ist ausgewählt",
    noFileSelected: "Keine Datei ausgewählt",
    noSintezaSelected: "Keine Synthese generiert",
    noQuizSelected: "Kein Quiz ausgewählt",
  },
  Japanese: {
    noSubjectSelected: "科目が選択されていません",
    noFileSelected: "ファイルが選択されていません",
    noSintezaSelected: "要約が生成されていません",
    noQuizSelected: "クイズが選択されていません",
  },
  Vietnamese: {
    noSubjectSelected: "Chưa chọn môn học nào",
    noFileSelected: "Chưa chọn tệp nào",
    noSintezaSelected: "Chưa tạo tổng hợp",
    noQuizSelected: "Chưa chọn bài kiểm tra",
  },
  Turkish: {
    noSubjectSelected: "Hiçbir ders seçili değil",
    noFileSelected: "Dosya seçilmedi",
    noSintezaSelected: "Özet oluşturulmadı",
    noQuizSelected: "Test seçilmedi",
  },
};

export function getNoSubjectSelectedText(language: string): PlaceholderText {
  return placeholderTexts[language as PlaceholderLanguage] ?? placeholderTexts["English"];
}

export default placeholderTexts;