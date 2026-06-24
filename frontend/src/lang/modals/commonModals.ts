export interface CommonModalText {
  cancel: string;
  confirm: string;
  deleteLabel: string;
  quizLabel: string;
  fileLabel: string;
  areYouSure: string;
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

export type CommonModalLanguage = (typeof supportedLanguages)[number];

const commonModalTexts: Record<CommonModalLanguage, CommonModalText> = {
  English: {
    cancel: "Cancel",
    confirm: "Confirm",
    deleteLabel: "Delete",
    quizLabel: "Quiz",
    fileLabel: "File",
    areYouSure: "Are you sure",
  },
  "Mandarin Chinese": {
    cancel: "取消",
    confirm: "确认",
    deleteLabel: "删除",
    quizLabel: "测验",
    fileLabel: "文件",
    areYouSure: "你确定",
  },
  Romanian: {
    cancel: "Anulează",
    confirm: "Confirmă",
    deleteLabel: "Șterge",
    quizLabel: "Quiz",
    fileLabel: "Fișier",
    areYouSure: "Ești sigur",
  },
  Spanish: {
    cancel: "Cancelar",
    confirm: "Confirmar",
    deleteLabel: "Eliminar",
    quizLabel: "Cuestionario",
    fileLabel: "Archivo",
    areYouSure: "Estás seguro",
  },
  "Modern Standard Arabic": {
    cancel: "إلغاء",
    confirm: "تأكيد",
    deleteLabel: "حذف",
    quizLabel: "اختبار",
    fileLabel: "ملف",
    areYouSure: "هل أنت متأكد",
  },
  French: {
    cancel: "Annuler",
    confirm: "Confirmer",
    deleteLabel: "Supprimer",
    quizLabel: "Quiz",
    fileLabel: "Fichier",
    areYouSure: "Êtes-vous sûr",
  },
  Russian: {
    cancel: "Отмена",
    confirm: "Подтвердить",
    deleteLabel: "Удалить",
    quizLabel: "Тест",
    fileLabel: "Файл",
    areYouSure: "Вы уверены",
  },
  German: {
    cancel: "Abbrechen",
    confirm: "Bestätigen",
    deleteLabel: "Löschen",
    quizLabel: "Quiz",
    fileLabel: "Datei",
    areYouSure: "Bist du sicher",
  },
  Japanese: {
    cancel: "キャンセル",
    confirm: "確認",
    deleteLabel: "削除",
    quizLabel: "クイズ",
    fileLabel: "ファイル",
    areYouSure: "本当に",
  },
  Vietnamese: {
    cancel: "Hủy",
    confirm: "Xác nhận",
    deleteLabel: "Xóa",
    quizLabel: "Quiz",
    fileLabel: "Tệp",
    areYouSure: "Bạn chắc chắn",
  },
  Turkish: {
    cancel: "İptal",
    confirm: "Onayla",
    deleteLabel: "Sil",
    quizLabel: "Quiz",
    fileLabel: "Dosya",
    areYouSure: "Emin misiniz",
  },
};

export function getCommonModalText(language: string): CommonModalText {
  return commonModalTexts[language as CommonModalLanguage] ?? commonModalTexts["English"];
}

export { supportedLanguages };

export const commonModalTextsArray: CommonModalText[] = [...supportedLanguages].map(
  (lang) => commonModalTexts[lang]
);

export default commonModalTexts;