import { addTypeTemplate, createResolver, defineNuxtModule } from '@nuxt/kit';
import { extractDefaultMessages, extractI18nModuleOptions, generateTypes } from './runtime/core';
import { consola } from 'consola';

export interface ModuleOptions {
  /** Fallback path to static json file to parse at build time to generate the types */
  fallBackStaticMessages?: string;
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
            src: resolve('./runtime/core/generate/templates/files/index.ts'),
            filename: 'i18n/index.d.ts',
            write: true,
          });

          addTypeTemplate({
            src: resolve('./runtime/core/generate/templates/files/type-utils.ts'),
            filename: 'i18n/type-utils.d.ts',
            write: true,
          });

          addTypeTemplate({
            src: resolve('./runtime/core/generate/templates/files/useI18n.ts'),
            filename: 'i18n/useI18n.d.ts',
            write: true,
          });

          addTypeTemplate({
            src: resolve('./runtime/core/generate/templates/files/global.ts'),
            filename: 'i18n/global.d.ts',
            write: true,
          });

          consola.success('[nuxt-typed-i18n] Types generated in .nuxt/i18n');
        } catch (error) {
          console.error('[nuxt-typed-i18n] Error generating types', { cause: error });
        }
      }
    });
  },
});
