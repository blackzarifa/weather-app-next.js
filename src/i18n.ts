export const locales = ['en', 'pt'];
export const defaultLocale = 'en';

import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default,
}));
