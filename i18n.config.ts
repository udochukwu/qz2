import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import frTranslations from './locales/fr.json';
import inTranslation from './locales/indonesian.json';
import prTranslation from './locales/portuguese.json';
import * as RNLocalize from "react-native-localize";

const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
console.log(RNLocalize.getTimeZone())
console.log("deviceLanguage", deviceLanguage);
i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        resources: {
            en: {
                translation: enTranslations
            },
            es: {
                translation: esTranslations
            },
            fr: {
                translation: frTranslations
            },
            id: {
                translation: inTranslation
            },
            pt: {
                translation: prTranslation
            },

            // ... include other languages here
        },
        lng: deviceLanguage,
        fallbackLng: 'en', // use English if the translation isn't available
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
