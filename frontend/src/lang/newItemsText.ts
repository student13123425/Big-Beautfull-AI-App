export interface NewItemTexts {
  addFile: string;
  createQuiz: string;
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

export type NewItemLanguage = (typeof supportedLanguages)[number];

const newItemsTexts: Record<NewItemLanguage, NewItemTexts> = {
  English: {
    addFile: "Add File",
    createQuiz: "Create Quiz",
  },
  "Mandarin Chinese": {
    addFile: "添加文件",
    createQuiz: "创建测验",
  },
  Romanian: {
    addFile: "Adaugă Fișier",
    createQuiz: "Creează Quiz",
  },
  Spanish: {
    addFile: "Añadir Archivo",
    createQuiz: "Crear Cuestionario",
  },
  "Modern Standard Arabic": {
    addFile: "إضافة ملف",
    createQuiz: "إنشاء اختبار",
  },
  French: {
    addFile: "Ajouter Fichier",
    createQuiz: "Créer Quiz",
  },
  Russian: {
    addFile: "Добавить Файл",
    createQuiz: "Создать Тест",
  },
  German: {
    addFile: "Datei Hinzufügen",
    createQuiz: "Quiz Erstellen",
  },
  Japanese: {
    addFile: "ファイルを追加",
    createQuiz: "クイズを作成",
  },
  Vietnamese: {
    addFile: "Thêm Tệp",
    createQuiz: "Tạo Bài Kiểm Tra",
  },
  Turkish: {
    addFile: "Dosya Ekle",
    createQuiz: "Test Oluştur",
  },
};

export function getNewItemsTexts(language: string): NewItemTexts {
  return newItemsTexts[language as NewItemLanguage] ?? newItemsTexts["English"];
}

export default newItemsTexts;