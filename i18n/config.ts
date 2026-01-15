// i18n/config.ts
export const i18nConfig = {
  defaultLocale: 'fr',
  locales: ['en', 'ar', "fr"],
  timeZone: process.env.TZ as string,
  formats: {
    dateTime: {
      short: {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }
    }
  }
} as const;