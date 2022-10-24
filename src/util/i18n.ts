import { initReactI18next } from 'react-i18next';
import translations from "./translations.json";
import i18n from 'i18next';

i18n.use(initReactI18next).init({
    resources: translations,
    lng: localStorage.getItem("lang") || "en",
    interpolation: {
        escapeValue: false
    }
})

if (!localStorage.getItem("lang") || !Object.keys(translations).includes(localStorage.getItem("lang") || "")) {
    let lang = (window.navigator.languages ? window.navigator.languages[0] : window.navigator.language) || 'en';
    lang = lang.indexOf('-') !== -1 ? lang.split('-')[0] : (lang.indexOf('_') !== -1 ? lang.split('_')[0] : lang);
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
}

export default i18n;