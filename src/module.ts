import { addTypeTemplate, createResolver, defineNuxtModule } from '@nuxt/kit';
import { extractDefaultMessages, extractI18nModuleOptions, generateTypes, createIndexTemplate } from './runtime/core';

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
    const i18nOptions = extractI18nModuleOptions(nuxt);

    nuxt.hook('modules:done', () => {
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
            filename: 'i18n/index.d.ts',
            getContents: () => createIndexTemplate(),
            write: true,
          });

          addTypeTemplate({
            src: resolve('./runtime/core/generate/templates/type-utils.d.ts'),
            filename: 'i18n/type-utils.d.ts',
            write: true,
          });

          addTypeTemplate({
            src: resolve('./runtime/core/generate/templates/useI18n.ts'),
            filename: 'i18n/useI18n.d.ts',
            write: true,
          });

          addTypeTemplate({
            src: resolve('./runtime/core/generate/templates/t.global.types.d.ts'),
            filename: 'i18n/t.global.types.d.ts',
            write: true,
          });
        } catch {
          //
        }
      }
    });
  },
});
