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