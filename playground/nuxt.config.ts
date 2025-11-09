export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n', '../src/module'],
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', files: ['en.json'] },
      { code: 'nl', name: 'Nederlands', file: 'nl.json' },
    ],
    langDir: 'locales',
  },
});
