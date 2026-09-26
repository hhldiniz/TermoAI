import en, { type Messages } from './en';
import pt from './pt';
import es from './es';

export type Language = 'pt' | 'en' | 'es';
export type { Messages };

const MESSAGES: Record<Language, Messages> = { pt, en, es };

// BCP 47 tags for <html lang>, used by screen readers and browser translation.
const HTML_LANG: Record<Language, string> = { pt: 'pt-BR', en: 'en', es: 'es' };

export function getMessages(lang: Language): Messages {
  return MESSAGES[lang];
}

export function getHtmlLang(lang: Language): string {
  return HTML_LANG[lang];
}
