export interface AskQuestionText {
  pageTitle: string;
  documentTypeLabel: string;
  questionLabel: string;
  questionPlaceholder: string;
  stopButton: string;
  clearButton: string;
  processingState: string;
  askQuestionButton: string;
  answerLabel: string;
  analyzingMessage: string;
  defaultEmptyState: string;
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

export type AskQuestionLanguage = (typeof supportedLanguages)[number];

const askQuestionTexts: Record<AskQuestionLanguage, AskQuestionText> = {
  English: {
    pageTitle: "Document Assistant",
    documentTypeLabel: "{file} Document",
    questionLabel: "Ask a question about this document",
    questionPlaceholder: "What information are you looking for?",
    stopButton: "Stop",
    clearButton: "Clear",
    processingState: "Processing...",
    askQuestionButton: "Ask Question",
    answerLabel: "Answer",
    analyzingMessage: "Analyzing document and preparing answer...",
    defaultEmptyState: "Submit a question to get insights from the document",
  },
  "Mandarin Chinese": {
    pageTitle: "文档助手",
    documentTypeLabel: "{file} 文档",
    questionLabel: "关于此文档提问",
    questionPlaceholder: "您在寻找什么信息？",
    stopButton: "停止",
    clearButton: "清除",
    processingState: "处理中...",
    askQuestionButton: "提问",
    answerLabel: "回答",
    analyzingMessage: "正在分析文档并准备答案...",
    defaultEmptyState: "提交问题以获取文档见解",
  },
  Romanian: {
    pageTitle: "Asistent Document",
    documentTypeLabel: "Document {file}",
    questionLabel: "Pune o întrebare despre acest document",
    questionPlaceholder: "Ce informații cauți?",
    stopButton: "Oprește",
    clearButton: "Șterge",
    processingState: "Se procesează...",
    askQuestionButton: "Pune Întrebarea",
    answerLabel: "Răspuns",
    analyzingMessage: "Se analizează documentul și se pregătește răspunsul...",
    defaultEmptyState: "Trimite o întrebare pentru a obține informații din document",
  },
  Spanish: {
    pageTitle: "Asistente de Documento",
    documentTypeLabel: "Documento {file}",
    questionLabel: "Haz una pregunta sobre este documento",
    questionPlaceholder: "¿Qué información estás buscando?",
    stopButton: "Detener",
    clearButton: "Limpiar",
    processingState: "Procesando...",
    askQuestionButton: "Hacer Pregunta",
    answerLabel: "Respuesta",
    analyzingMessage: "Analizando documento y preparando respuesta...",
    defaultEmptyState: "Envía una pregunta para obtener información del documento",
  },
  "Modern Standard Arabic": {
    pageTitle: "مساعد المستند",
    documentTypeLabel: "وثيقة {file}",
    questionLabel: "اطرح سؤالاً حول هذا المستند",
    questionPlaceholder: "ما المعلومات التي تبحث عنها؟",
    stopButton: "إيقاف",
    clearButton: "مسح",
    processingState: "جاري المعالجة...",
    askQuestionButton: "طرح سؤال",
    answerLabel: "الإجابة",
    analyzingMessage: "تحليل المستند وإعداد الإجابة...",
    defaultEmptyState: "أرسل سؤالاً للحصول على رؤى من المستند",
  },
  French: {
    pageTitle: "Assistant de Document",
    documentTypeLabel: "Document {file}",
    questionLabel: "Posez une question sur ce document",
    questionPlaceholder: "Quelles informations recherchez-vous ?",
    stopButton: "Arrêter",
    clearButton: "Effacer",
    processingState: "Traitement en cours...",
    askQuestionButton: "Poser la Question",
    answerLabel: "Réponse",
    analyzingMessage: "Analyse du document et préparation de la réponse...",
    defaultEmptyState: "Soumettez une question pour obtenir des informations du document",
  },
  Russian: {
    pageTitle: "Документальный Помощник",
    documentTypeLabel: "Документ {file}",
    questionLabel: "Задайте вопрос об этом документе",
    questionPlaceholder: "Какую информацию вы ищете?",
    stopButton: "Остановить",
    clearButton: "Очистить",
    processingState: "Обработка...",
    askQuestionButton: "Задать Вопрос",
    answerLabel: "Ответ",
    analyzingMessage: "Анализ документа и подготовка ответа...",
    defaultEmptyState: "Отправьте вопрос, чтобы получить информацию из документа",
  },
  German: {
    pageTitle: "Dokumenten-Assistent",
    documentTypeLabel: "Dokument {file}",
    questionLabel: "Stellen Sie eine Frage zu diesem Dokument",
    questionPlaceholder: "Welche Information suchst du?",
    stopButton: "Stoppen",
    clearButton: "Löschen",
    processingState: "Verarbeitung...",
    askQuestionButton: "Frage Stellen",
    answerLabel: "Antwort",
    analyzingMessage: "Dokument wird analysiert und Antwort vorbereitet...",
    defaultEmptyState: "Stellen Sie eine Frage, um Erkenntnisse aus dem Dokument zu erhalten",
  },
  Japanese: {
    pageTitle: "ドキュメントアシスタント",
    documentTypeLabel: "{file} ドキュメント",
    questionLabel: "このドキュメントについて質問してください",
    questionPlaceholder: "どのような情報をお探しですか？",
    stopButton: "停止",
    clearButton: "クリア",
    processingState: "処理中...",
    askQuestionButton: "質問する",
    answerLabel: "回答",
    analyzingMessage: "ドキュメントを分析して回答を準備しています...",
    defaultEmptyState: "質問を送信してドキュメントから洞察を得てください",
  },
  Vietnamese: {
    pageTitle: "Trợ Lý Tài Liệu",
    documentTypeLabel: "Tài liệu {file}",
    questionLabel: "Đặt câu hỏi về tài liệu này",
    questionPlaceholder: "Bạn đang tìm thông tin gì?",
    stopButton: "Dừng",
    clearButton: "Xóa",
    processingState: "Đang xử lý...",
    askQuestionButton: "Đặt Câu Hỏi",
    answerLabel: "Câu Trả Lời",
    analyzingMessage: "Đang phân tích tài liệu và chuẩn bị câu trả lời...",
    defaultEmptyState: "Gửi câu hỏi để nhận thông tin từ tài liệu",
  },
  Turkish: {
    pageTitle: "Belge Asistanı",
    documentTypeLabel: "{file} Belgesi",
    questionLabel: "Bu belge hakkında bir soru sorun",
    questionPlaceholder: "Ne bilgiyi arıyorsunuz?",
    stopButton: "Durdur",
    clearButton: "Temizle",
    processingState: "İşleniyor...",
    askQuestionButton: "Soru Sor",
    answerLabel: "Cevap",
    analyzingMessage: "Belge analiz ediliyor ve cevap hazırlanıyor...",
    defaultEmptyState: "Belgeden bilgi almak için bir soru gönderin",
  },
};

export function getAskQuestionText(language: string): AskQuestionText {
  return askQuestionTexts[language as AskQuestionLanguage] ?? askQuestionTexts["English"];
}

export { supportedLanguages };

export const askQuestionTextsArray: AskQuestionText[] = [...supportedLanguages].map(
  (lang) => askQuestionTexts[lang]
);

export default askQuestionTexts;