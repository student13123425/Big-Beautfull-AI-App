export interface QuizPageText {
  pageTitle: string;
  cardTitle: string;
  quizTitleLabel: string;
  quizTitlePlaceholder: string;
  multipleChoiceLabel: string;
  questionsPerFileLabel: string;
  ctrlHint: string;
  selectFilesLabel: string;
  startGenerationButton: string;
  invalidDataTitle: string;
  invalidDataMessage: string;
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

export type QuizLanguage = (typeof supportedLanguages)[number];

const quizTexts: Record<QuizLanguage, QuizPageText> = {
  English: {
    pageTitle: "Create Quiz",
    cardTitle: "Quiz Options",
    quizTitleLabel: "Quiz Title",
    quizTitlePlaceholder: "Enter quiz title...",
    multipleChoiceLabel: "Multiple choice quiz (Grila)",
    questionsPerFileLabel: "Questions per File",
    ctrlHint: "(Hold Ctrl for larger steps)",
    selectFilesLabel: "Select files:",
    startGenerationButton: "Start Generation",
    invalidDataTitle: "Data Error",
    invalidDataMessage: "invalid data for quiz creation",
  },
  "Mandarin Chinese": {
    pageTitle: "创建测验",
    cardTitle: "测验选项",
    quizTitleLabel: "测验标题",
    quizTitlePlaceholder: "输入测验标题...",
    multipleChoiceLabel: "选择题测验（Grila）",
    questionsPerFileLabel: "每文件问题数",
    ctrlHint: "(按住Ctrl进行更大步幅)",
    selectFilesLabel: "选择文件：",
    startGenerationButton: "开始生成",
    invalidDataTitle: "数据错误",
    invalidDataMessage: "创建测验的数据无效",
  },
  Romanian: {
    pageTitle: "Creează Quiz",
    cardTitle: "Opțiuni Quiz",
    quizTitleLabel: "Titlu Quiz",
    quizTitlePlaceholder: "Introduceți titlul quiz...",
    multipleChoiceLabel: "Quiz cu alegere multiplă (Grila)",
    questionsPerFileLabel: "Întrebări per Fișier",
    ctrlHint: "(Ține Ctrl pentru pași mai mari)",
    selectFilesLabel: "Selectează fișiere:",
    startGenerationButton: "Pornește Generarea",
    invalidDataTitle: "Eroare Date",
    invalidDataMessage: "date nevalide pentru crearea quiz-ului",
  },
  Spanish: {
    pageTitle: "Crear Cuestionario",
    cardTitle: "Opciones del Cuestionario",
    quizTitleLabel: "Título del Cuestionario",
    quizTitlePlaceholder: "Ingrese el título del cuestionario...",
    multipleChoiceLabel: "Cuestionario de opción múltiple (Grila)",
    questionsPerFileLabel: "Preguntas por Archivo",
    ctrlHint: "(Mantenga Ctrl para pasos más grandes)",
    selectFilesLabel: "Seleccionar archivos:",
    startGenerationButton: "Iniciar Generación",
    invalidDataTitle: "Error de Datos",
    invalidDataMessage: "datos inválidos para la creación del cuestionario",
  },
  "Modern Standard Arabic": {
    pageTitle: "إنشاء اختبار",
    cardTitle: "خيارات الاختبار",
    quizTitleLabel: "عنوان الاختبار",
    quizTitlePlaceholder: "أدخل عنوان الاختبار...",
    multipleChoiceLabel: "اختيار متعدد للاختبار (Grila)",
    questionsPerFileLabel: "أسئلة لكل ملف",
    ctrlHint: "(اضغط Ctrl لخطوات أكبر)",
    selectFilesLabel: "تحديد الملفات:",
    startGenerationButton: "بدء الإنشاء",
    invalidDataTitle: "خطأ في البيانات",
    invalidDataMessage: "بيانات غير صالحة لإنشاء الاختبار",
  },
  French: {
    pageTitle: "Créer un Quiz",
    cardTitle: "Options du Quiz",
    quizTitleLabel: "Titre du Quiz",
    quizTitlePlaceholder: "Entrez le titre du quiz...",
    multipleChoiceLabel: "Quiz à choix multiples (Grila)",
    questionsPerFileLabel: "Questions par Fichier",
    ctrlHint: "(Maintenez Ctrl pour des pas plus grands)",
    selectFilesLabel: "Sélectionner les fichiers :",
    startGenerationButton: "Démarrer la Génération",
    invalidDataTitle: "Erreur de Données",
    invalidDataMessage: "données invalides pour la création du quiz",
  },
  Russian: {
    pageTitle: "Создать Тест",
    cardTitle: "Настройки Теста",
    quizTitleLabel: "Название Теста",
    quizTitlePlaceholder: "Введите название теста...",
    multipleChoiceLabel: "Тест с множественным выбором (Grila)",
    questionsPerFileLabel: "Вопросов на Файл",
    ctrlHint: "(Удерживайте Ctrl для больших шагов)",
    selectFilesLabel: "Выбрать файлы:",
    startGenerationButton: "Начать Генерацию",
    invalidDataTitle: "Ошибка Данных",
    invalidDataMessage: "неверные данные для создания теста",
  },
  German: {
    pageTitle: "Quiz Erstellen",
    cardTitle: "Quiz-Optionen",
    quizTitleLabel: "Quiz-Titel",
    quizTitlePlaceholder: "Geben Sie den Quiz-Titel ein...",
    multipleChoiceLabel: "Multiple-Choice-Quiz (Grila)",
    questionsPerFileLabel: "Fragen pro Datei",
    ctrlHint: "(Strg gedrückt halten für größere Schritte)",
    selectFilesLabel: "Dateien auswählen:",
    startGenerationButton: "Generierung Starten",
    invalidDataTitle: "Datenfehler",
    invalidDataMessage: "ungültige Daten zur Quiz-Erstellung",
  },
  Japanese: {
    pageTitle: "クイズ作成",
    cardTitle: "クイズオプション",
    quizTitleLabel: "クイズタイトル",
    quizTitlePlaceholder: "クイズタイトルを入力...",
    multipleChoiceLabel: "選択式クイズ（Grila）",
    questionsPerFileLabel: "ファイルあたりの質問数",
    ctrlHint: "(Ctrlキーを押して大規模なステップ)",
    selectFilesLabel: "ファイルを選択：",
    startGenerationButton: "生成開始",
    invalidDataTitle: "データエラー",
    invalidDataMessage: "クイズ作成の無効なデータ",
  },
  Vietnamese: {
    pageTitle: "Tạo Quiz",
    cardTitle: "Tùy Chọn Quiz",
    quizTitleLabel: "Tiêu Đề Quiz",
    quizTitlePlaceholder: "Nhập tiêu đề quiz...",
    multipleChoiceLabel: "Quiz trắc nghiệm (Grila)",
    questionsPerFileLabel: "Câu Hỏi Mỗi File",
    ctrlHint: "(Giữ Ctrl để tăng bước lớn hơn)",
    selectFilesLabel: "Chọn tệp:",
    startGenerationButton: "Bắt Đầu Tạo",
    invalidDataTitle: "Lỗi Dữ Liệu",
    invalidDataMessage: "dữ liệu không hợp lệ để tạo quiz",
  },
  Turkish: {
    pageTitle: "Quiz Oluştur",
    cardTitle: "Quiz Seçenekleri",
    quizTitleLabel: "Quiz Başlığı",
    quizTitlePlaceholder: "Quiz başlığını girin...",
    multipleChoiceLabel: "Çok seçimli quiz (Grila)",
    questionsPerFileLabel: "Dosya Başına Soru",
    ctrlHint: "(Daha büyük adımlar için Ctrl'e basın)",
    selectFilesLabel: "Dosyaları seç:",
    startGenerationButton: "Oluşturmayı Başlat",
    invalidDataTitle: "Veri Hatası",
    invalidDataMessage: "quiz oluşturma için geçersiz veriler",
  },
};

export function getQuizPageText(language: string): QuizPageText {
  return quizTexts[language as QuizLanguage] ?? quizTexts["English"];
}

export { supportedLanguages };

export const quizPageTextsArray: QuizPageText[] = [...supportedLanguages].map(
  (lang) => quizTexts[lang]
);

export default quizTexts;