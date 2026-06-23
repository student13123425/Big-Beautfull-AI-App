export interface AddMaterieModalText {
  title: string;
  placeholder: string;
  content: string;
  cancelText: string;
  submitText: string;
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

export type AddMaterieLanguage = (typeof supportedLanguages)[number];

const addMaterieTexts: Record<AddMaterieLanguage, AddMaterieModalText> = {
  English: {
    title: "Add New Subject",
    placeholder: "subject name",
    content: "Enter the new subject name",
    cancelText: "Cancel",
    submitText: "Submit",
  },
  "Mandarin Chinese": {
    title: "添加新科目",
    placeholder: "科目名称",
    content: "输入新课程名称",
    cancelText: "取消",
    submitText: "提交",
  },
  Romanian: {
    title: "adaugare materie",
    placeholder: "nume materie",
    content: "introdu numele noi materi",
    cancelText: "Anulează",
    submitText: "Submit",
  },
  Spanish: {
    title: "Agregar Nueva Materia",
    placeholder: "nombre de la materia",
    content: "Introduce el nombre de la nueva materia",
    cancelText: "Cancelar",
    submitText: "Enviar",
  },
  "Modern Standard Arabic": {
    title: "إضافة مادة جديدة",
    placeholder: "اسم المادة",
    content: "أدخل اسم المادة الجديدة",
    cancelText: "إلغاء",
    submitText: "إرسال",
  },
  French: {
    title: "Ajouter Nouvelle Matière",
    placeholder: "nom de la matière",
    content: "Entrez le nom de la nouvelle matière",
    cancelText: "Annuler",
    submitText: "Soumettre",
  },
  Russian: {
    title: "Добавить Новый Предмет",
    placeholder: "название предмета",
    content: "Введите название нового предмета",
    cancelText: "Отмена",
    submitText: "Отправить",
  },
  German: {
    title: "Neues Fach Hinzufügen",
    placeholder: "Fachname",
    content: "Geben Sie den Namen des neuen Faches ein",
    cancelText: "Abbrechen",
    submitText: "Senden",
  },
  Japanese: {
    title: "新しい科目を追加",
    placeholder: "科目名",
    content: "新しい科目の名前を入力してください",
    cancelText: "キャンセル",
    submitText: "送信",
  },
  Vietnamese: {
    title: "Thêm Môn Học Mới",
    placeholder: "tên môn học",
    content: "Nhập tên môn học mới",
    cancelText: "Hủy",
    submitText: "Gửi",
  },
  Turkish: {
    title: "Yeni Ders Ekle",
    placeholder: "ders adı",
    content: "Yeni dersin adını girin",
    cancelText: "İptal",
    submitText: "Gönder",
  },
};

export function getAddMaterieText(language: string): AddMaterieModalText {
  return addMaterieTexts[language as AddMaterieLanguage] ?? addMaterieTexts["English"];
}

export default addMaterieTexts;