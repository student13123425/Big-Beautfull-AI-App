export interface TopBarLogoutModalText {
  title: string;
  content: string;
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

export type TopBarLogoutLanguage = (typeof supportedLanguages)[number];

const topBarLogoutTexts: Record<TopBarLogoutLanguage, TopBarLogoutModalText> = {
  English: {
    title: "Logout",
    content: "Are you sure you want to logout?",
  },
  "Mandarin Chinese": {
    title: "退出登录",
    content: "您确定要退出登录吗？",
  },
  Romanian: {
    title: "Deconectare",
    content: "Esti sigur că vrei să te deconectezi?",
  },
  Spanish: {
    title: "Cerrar sesión",
    content: "¿Estás seguro de que quieres cerrar sesión?",
  },
  "Modern Standard Arabic": {
    title: "تسجيل الخروج",
    content: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
  },
  French: {
    title: "Déconnexion",
    content: "Êtes-vous sûr de vouloir vous déconnecter ?",
  },
  Russian: {
    title: "Выход",
    content: "Вы уверены, что хотите выйти?",
  },
  German: {
    title: "Abmelden",
    content: "Bist du sicher, dass du dich abmelden möchtest?",
  },
  Japanese: {
    title: "ログアウト",
    content: "ログアウトしてもよろしいですか？",
  },
  Vietnamese: {
    title: "Đăng xuất",
    content: "Bạn có chắc chắn muốn đăng xuất không?",
  },
  Turkish: {
    title: "Çıkış",
    content: "Çıkmak istediğinize emin misiniz?",
  },
};

export function getTopBarLogoutText(language: string): TopBarLogoutModalText {
  return topBarLogoutTexts[language as TopBarLogoutLanguage] ?? topBarLogoutTexts["English"];
}

export { supportedLanguages };

export const topBarLogoutTextsArray: TopBarLogoutModalText[] = [...supportedLanguages].map(
  (lang) => topBarLogoutTexts[lang]
);

export default topBarLogoutTexts;