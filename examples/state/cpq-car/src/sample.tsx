//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import { Trans, useTranslation } from 'react-i18next';
import './i18n/config';

function Sample() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        console.log('lang', lang);
        i18n.changeLanguage(lang);
    }

    return (<div className="text-center p-2">
        <div>
            <button onClick={() => changeLanguage('en')}>EN</button>
            <button onClick={() => changeLanguage('fr')}>FR</button>
        </div>
        <div className="p-2">{t('hello')}</div>
        <div className="p-2">{t('title')}</div>
        <div>
            <Trans i18nKey="description.part1">This is part1</Trans>
        </div>
    </div >
    );
}

export default Sample;