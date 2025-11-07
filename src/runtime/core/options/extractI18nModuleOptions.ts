import type { NuxtI18nOptions } from '@nuxtjs/i18n';
import type { Nuxt } from 'nuxt/schema';

/**
 * Search the @nuxtjs/i18n module options in the Nuxt configuration
 * Can be inline configuration or using the config key
 *
 * @param nuxt - The Nuxt instance
 * @returns The @nuxtjs/i18n module options or undefined if not found
 */
export function extractI18nModuleOptions(nuxt: Nuxt): NuxtI18nOptions | undefined {
  let i18nOptions: NuxtI18nOptions | undefined = undefined;

  nuxt.options.modules.some((mod) => {
    if (Array.isArray(mod)) {
      const [moduleName, options] = mod;
      const isRegistered = moduleName === '@nuxtjs/i18n';
      if (isRegistered) {
        i18nOptions = options;
      }
    } else {
      const isRegistered = mod === '@nuxtjs/i18n';
      if (isRegistered) {
        i18nOptions = nuxt.options.i18n;
      }
    }
  });

  return i18nOptions;
}
