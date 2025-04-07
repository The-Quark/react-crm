import { toAbsoluteUrl } from '@/utils';
import enMessages from './messages/en.json';
import ruMessages from './messages/ru.json';
import { type TLanguage } from './types.d';

const I18N_MESSAGES = {
  en: enMessages,
  ru: ruMessages
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
  }
];

const I18N_DEFAULT_LANGUAGE: TLanguage = I18N_LANGUAGES[0];

export { I18N_CONFIG_KEY, I18N_DEFAULT_LANGUAGE, I18N_LANGUAGES, I18N_MESSAGES };
