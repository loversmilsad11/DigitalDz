import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
const locales = ['ar', 'fr'];

export default getRequestConfig(async ({ locale: oldLocale, requestLocale }) => {
  const locale = await requestLocale;
  console.log(`[getRequestConfig] locale: "${locale}", oldLocale: "${oldLocale}"`);
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as any)) {
    console.log(`[getRequestConfig] locale not found: "${locale}"`);
    notFound();
  }

  return {
    locale: locale as string,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
