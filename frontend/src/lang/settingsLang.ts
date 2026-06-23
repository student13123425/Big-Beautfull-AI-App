export interface SettingsPageText {
  pageTitle: string;
  systemPromptTitle: string;
  systemPromptPlaceholder: string;
  languageSectionTitle: string;
  contextSizeTitle: string;
  contextSizeUnit: string;
  contextSizeDescription: string;
  htmlStyleTitle: string;
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

export type SettingsLanguage = (typeof supportedLanguages)[number];

const settingsTexts: Record<SettingsLanguage, SettingsPageText> = {
  English: {
    pageTitle: "Application Settings",
    systemPromptTitle: "AI System Prompt",
    systemPromptPlaceholder: "Define the AI's role and behavior here...",
    languageSectionTitle: "Language",
    contextSizeTitle: "Max Context Size",
    contextSizeUnit: "Tokens",
    contextSizeDescription: "Defines the maximum amount of information the AI can remember.",
    htmlStyleTitle: "HTML Style",
  },
  "Mandarin Chinese": {
    pageTitle: "应用程序设置",
    systemPromptTitle: "AI 系统提示",
    systemPromptPlaceholder: "在此定义 AI 的角色和行为...",
    languageSectionTitle: "语言",
    contextSizeTitle: "最大上下文大小",
    contextSizeUnit: "标记",
    contextSizeDescription: "定义 AI 可以记住的最大信息量。",
    htmlStyleTitle: "HTML 样式",
  },
  Romanian: {
    pageTitle: "Setări Aplicație",
    systemPromptTitle: "Prompt Sistem AI",
    systemPromptPlaceholder: "Definește rolul și comportamentul AI aici...",
    languageSectionTitle: "Limbă",
    contextSizeTitle: "Dimensiune Maximă Context",
    contextSizeUnit: "Cuvinte cheie",
    contextSizeDescription: "Definește cantitatea maximă de informații pe care o poate reține AI.",
    htmlStyleTitle: "Stil HTML",
  },
  Spanish: {
    pageTitle: "Configuración de la Aplicación",
    systemPromptTitle: "Indicación del Sistema AI",
    systemPromptPlaceholder: "Define el rol y comportamiento del AI aquí...",
    languageSectionTitle: "Idioma",
    contextSizeTitle: "Tamaño Máximo del Contexto",
    contextSizeUnit: "Tokens",
    contextSizeDescription: "Define la cantidad máxima de información que la IA puede recordar.",
    htmlStyleTitle: "Estilo HTML",
  },
  "Modern Standard Arabic": {
    pageTitle: "إعدادات التطبيق",
    systemPromptTitle: "موجه نظام الذكاء الاصطناعي",
    systemPromptPlaceholder: "حدد دور وسلوك الذكاء الاصطناعي هنا...",
    languageSectionTitle: "اللغة",
    contextSizeTitle: "الحد الأقصى لحجم السياق",
    contextSizeUnit: "رموز",
    contextSizeDescription: "يحدد الحد الأقصى لمعلومات التي يمكن للذكاء الاصطناعي تذكرها.",
    htmlStyleTitle: "أسلوب HTML",
  },
  French: {
    pageTitle: "Paramètres de l'Application",
    systemPromptTitle: "Invite Système IA",
    systemPromptPlaceholder: "Définissez le rôle et le comportement de l'IA ici...",
    languageSectionTitle: "Langue",
    contextSizeTitle: "Taille Maximale du Contexte",
    contextSizeUnit: "Jetons",
    contextSizeDescription: "Définit la quantité maximale d'informations que l'IA peut mémoriser.",
    htmlStyleTitle: "Style HTML",
  },
  Russian: {
    pageTitle: "Настройки Приложения",
    systemPromptTitle: "Системный Запрос ИИ",
    systemPromptPlaceholder: "Определите роль и поведение ИИ здесь...",
    languageSectionTitle: "Язык",
    contextSizeTitle: "Максимальный Размер Контекста",
    contextSizeUnit: "Токенов",
    contextSizeDescription: "Определяет максимальное количество информации, которую может запомнить ИИ.",
    htmlStyleTitle: "HTML Стиль",
  },
  German: {
    pageTitle: "Anwendungseinstellungen",
    systemPromptTitle: "KI-Systemaufforderung",
    systemPromptPlaceholder: "Definieren Sie hier die Rolle und das Verhalten der KI...",
    languageSectionTitle: "Sprache",
    contextSizeTitle: "Maximale Kontextgröße",
    contextSizeUnit: "Tokens",
    contextSizeDescription: "Definiert die maximale Anzahl von Informationen, die sich die KI merken kann.",
    htmlStyleTitle: "HTML-Stil",
  },
  Japanese: {
    pageTitle: "アプリケーション設定",
    systemPromptTitle: "AIシステムプロンプト",
    systemPromptPlaceholder: "ここでAIの役割と行動を定義してください...",
    languageSectionTitle: "言語",
    contextSizeTitle: "最大コンテキストサイズ",
    contextSizeUnit: "トークン",
    contextSizeDescription: "AIが記憶できる最大情報を定義します。",
    htmlStyleTitle: "HTMLスタイル",
  },
  Vietnamese: {
    pageTitle: "Cài Đặt Ứng Dụng",
    systemPromptTitle: "Gợi Ý Hệ Thống AI",
    systemPromptPlaceholder: "Định nghĩa vai trò và hành vi của AI tại đây...",
    languageSectionTitle: "Ngôn Ngữ",
    contextSizeTitle: "Kích Ngữ Cảnh Tối Đa",
    contextSizeUnit: "Token",
    contextSizeDescription: "Xác định lượng thông tin tối đa mà AI có thể ghi nhớ.",
    htmlStyleTitle: "Kiểu HTML",
  },
  Turkish: {
    pageTitle: "Uygulama Ayarları",
    systemPromptTitle: "AI Sistem İstemci",
    systemPromptPlaceholder: "AI'nin rolünü ve davranışını burada tanımlayın...",
    languageSectionTitle: "Dil",
    contextSizeTitle: "Maksimum Bağlam Boyutu",
    contextSizeUnit: "Tokenler",
    contextSizeDescription: "AI'nin hatırlayabileceği maksimum bilgi miktarını tanımlar.",
    htmlStyleTitle: "HTML Stili",
  },
};

export function getSettingsPageText(language: string): SettingsPageText {
  return settingsTexts[language as SettingsLanguage] ?? settingsTexts["English"];
}

export { supportedLanguages };

export const settingsPageTextsArray: SettingsPageText[] = [...supportedLanguages].map(
  (lang) => settingsTexts[lang]
);

export default settingsTexts;