import { toAbsoluteUrl } from '@/utils';
import { type TLanguage } from './types.d';
import arMessages from './locales/ar/ar.ts';
import enMessages from './locales/en/en.ts';
import ruMessages from './locales/ru/ru.ts';

const I18N_MESSAGES = {
  en: enMessages,
  ru: ruMessages,
  ar: arMessages
};

const I18N_CONFIG_KEY = 'i18nConfig';

const I18N_LANGUAGES: readonly TLanguage[] = [
  {
    label: 'English',
    code: 'en',
    direction: 'ltr',
    flag: toAbsoluteUrl('/media/flags/united-kingdom.svg'),
    messages: I18N_MESSAGES.en
  },
  {
    label: 'Russian',
    code: 'ru',
    direction: 'ltr',
    flag: toAbsoluteUrl('/media/flags/russia.svg'),
    messages: I18N_MESSAGES.ru
  },
  {
    label: 'Arabic',
    code: 'ar',
    direction: 'rtl',
    flag: toAbsoluteUrl('/media/flags/saudi-arabia.svg'),
    messages: I18N_MESSAGES.ar
  }
];

const I18N_DEFAULT_LANGUAGE: TLanguage = I18N_LANGUAGES[0];

export { I18N_CONFIG_KEY, I18N_DEFAULT_LANGUAGE, I18N_LANGUAGES, I18N_MESSAGES };
