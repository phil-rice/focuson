import i18n from 'i18next';
import translationEN from './en/translation.json';
import translationFR from './fr/translation.json';

import { initReactI18next } from 'react-i18next';

export const resources = {
    en: {
        translation: translationEN,
    },
    fr: {
        translation: translationFR
    }
};

i18n.use(initReactI18next).init({
    lng: 'en',
    resources,
});