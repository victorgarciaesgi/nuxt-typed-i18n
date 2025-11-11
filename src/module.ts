import { addPlugin, addTypeTemplate, createResolver, defineNuxtModule } from '@nuxt/kit';
import { consola } from 'consola';
import { extractDefaultMessages, extractI18nModuleOptions, generateTypes } from './runtime/core';
import { GLOBAL_DECLARATIONS } from './runtime/core/generate/templates/contents/global';
export interface ModuleOptions {
  /** Fallback path to static json file to parse at build time to generate the types */
  fallBackFile?: string;
  /**
   * Translation keys to ignore
   */
  ignoreKeys?: string[];
  /**
   * Translation keys to ignore when trying to extract parameter. Ex: regex keys
   */
  ignoreKeysParametersExtract?: string[];
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-typed-i18n',
    configKey: 'nuxtTypedI18n',
    compatibility: {
      nuxt: '>= 3.11.0',
    },
  },
  defaults: {},
  moduleDependencies: {
    '@nuxtjs/i18n': {
      version: '>=10.1.2',
    },
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    nuxt.hook('modules:done', () => {
      const i18nOptions = extractI18nModuleOptions(nuxt);

      if (!i18nOptions) {
        console.error('[nuxt-typed-i18n] @nuxtjs/i18n module is not registered');
      } else {
        try {
          const locales = extractDefaultMessages({ ...i18nOptions, ...options }, nuxt);

          const translationTemplate = generateTypes({ locales, options });

          addTypeTemplate({
            filename: 'i18n/translations.d.ts',
            getContents: () => translationTemplate,
            write: true,
          });

          addTypeTemplate({
            src: resolve('./runtime/core/generate/templates/files/index.d.ts'),
            filename: 'i18n/index.d.ts',
            write: true,
          });

          addTypeTemplate({
            src: resolve('./runtime/core/generate/templates/files/type-utils.d.ts'),
            filename: 'i18n/type-utils.d.ts',
            write: true,
          });

          addTypeTemplate({
            getContents: () => GLOBAL_DECLARATIONS,
            filename: 'i18n/global.d.ts',
            write: true,
          });

          addTypeTemplate({
            src: resolve('./runtime/core/generate/templates/files/i18n-component.d.ts'),
            filename: 'i18n/i18n-component.d.ts',
            write: true,
          });

          nuxt.options.alias = {
            ...nuxt.options.alias,
            '@i18n': resolve(`${nuxt.options.rootDir}/.nuxt/i18n`),
          };

          // Force register of type declaration
          nuxt.hook('prepare:types', (options) => {
            options.tsConfig.include?.unshift('./i18n/index.d.ts');
            // removeVueI18nDefinitions({ rootDir: nuxt.options.rootDir });
          });

          consola.success('[nuxt-typed-i18n] Types generated in .nuxt/i18n');
        } catch (error) {
          console.error('[nuxt-typed-i18n] Error generating types', { cause: error });
        }
      }

      addPlugin({
        src: resolve('./runtime/plugins/register-components'),
      });
    });
  },
});
