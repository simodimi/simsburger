// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  fr: {
    translation: {
      informations: "Informations du compte",
      nom: "Nom",
      email: "Adresse email",
      langues: "Langues",
      parDefaut: "Par défaut",
      choisirLangue: "Choisir une autre langue",
      securite: "Sécurité et confidentialité",
      deconnexion: "Se déconnecter",
      supprimerCompte: "Supprimer le compte",
      support: "Support",
      faq: "Foire aux questions",
    },
  },
  en: {
    translation: {
      informations: "Account Information",
      nom: "Name",
      email: "Email address",
      langues: "Languages",
      parDefaut: "Default",
      choisirLangue: "Choose another language",
      securite: "Security & Privacy",
      deconnexion: "Log out",
      supprimerCompte: "Delete account",
      support: "Support",
      faq: "FAQ",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "fr",
  fallbackLng: "fr",
  interpolation: { escapeValue: false },
});

export default i18n;
