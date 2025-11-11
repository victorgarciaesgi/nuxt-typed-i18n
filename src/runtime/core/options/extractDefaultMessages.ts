import type { LocaleFile, LocaleObject, NuxtI18nOptions } from '@nuxtjs/i18n';
import path from 'path';
import type { ModuleOptions } from '../../../module';
import { isEmpty } from '../../utils/isEmpty';
import type { Nuxt } from 'nuxt/schema';
import type { ExtractDefaultMessagesPayload } from '../../types/payloads';
import { extractContentFromFile } from './extractContentFromFile';

/**
 * Extract default messages from the defaultLocale
 * Only default messages are needed to generate the types
 */
export function extractDefaultMessages(
  { locales, langDir, fallBackFile, ignoreKeys, defaultLocale }: NuxtI18nOptions & ModuleOptions,
  nuxt: Nuxt
): ExtractDefaultMessagesPayload {
  let defaultMessagesFound = false;
  let defaultMessages: Record<string, string> = {};
  const availableLocales: string[] = [];
  let defaultLocaleFound: string | undefined = defaultLocale ?? undefined;

  if (!locales) {
    throw new Error('[nuxt-typed-i18n] No locales found');
  }

  function tryExtractFromLocaleFile(file: string | LocaleFile): Record<string, string> | undefined {
    let messages: Record<string, string> | undefined = undefined;
    const fileName = typeof file === 'string' ? file : file.path;

    if (langDir && nuxt.options.rootDir) {
      messages = extractContentFromFile({ fileName, langDir, nuxt });
    }
    return messages;
  }

  function tryParseLocale(locale?: LocaleObject<string>): boolean {
    if (!defaultMessagesFound) {
      if (locale?.file != null) {
        const messages = tryExtractFromLocaleFile(locale.file);
        if (messages) {
          defaultMessages = messages;
          defaultMessagesFound = true;
          defaultLocaleFound = locale.code;
          return true;
        }
      } else if (locale?.files != null) {
        for (const file of locale.files) {
          const messages = tryExtractFromLocaleFile(file);
          if (messages) {
            defaultMessages = messages;
            defaultMessagesFound = true;
            defaultLocaleFound = locale.code;
            return true;
          }
        }
      }
    }

    return false;
  }

  const isDefaultLocaleParsable = locales.find(
    (locale) => typeof locale !== 'string' && locale.code === defaultLocale
  ) as LocaleObject<string> | undefined;

  const success = tryParseLocale(isDefaultLocaleParsable);

  if (!success) {
    for (const locale of locales) {
      if (typeof locale === 'string') {
        if (langDir) {
          defaultMessages = extractContentFromFile({ fileName: `${locale}.json`, langDir, nuxt });
        }
      } else {
        if (locale.file != null && !defaultMessagesFound) {
          const fileName = typeof locale.file === 'string' ? locale.file : locale.file.path;

          if (langDir && nuxt.options.rootDir) {
            defaultMessages = extractContentFromFile({ fileName, langDir, nuxt });
            defaultMessagesFound = true;
            defaultLocaleFound = locale.code;
            break;
          }
        }
      }
    }
  }

  for (const locale of locales) {
    if (typeof locale === 'string') {
      if (!availableLocales.includes(locale)) {
        availableLocales.push(locale);
      }
    } else {
      if (!availableLocales.includes(locale.code)) {
        availableLocales.push(locale.code);
      }
    }
  }

  if (isEmpty(defaultMessages)) {
    if (fallBackFile && path.isAbsolute(fallBackFile)) {
      defaultMessages = extractContentFromFile({ fileName: fallBackFile, nuxt });
    }
  }

  /**
   * Removes keys present in the `ignoreKeys` option
   */
  const filteredDefaultMessages = Object.fromEntries(
    Object.entries(defaultMessages).filter(([key]) => !ignoreKeys?.includes(key))
  );

  return { defaultMessages: filteredDefaultMessages, availableLocales, defaultLocaleFound };
}
