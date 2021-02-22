//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
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