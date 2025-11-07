import type { TranslateOptions } from 'vue-i18n';
import type { TranslationKey } from './type-utils';
import type { TranslationsDictionary } from './translations';

declare module 'vue-i18n' {
  type TypedComposerTranslation<Locales = 'en-US'> = <Key extends TranslationKey>(
    key: Key,
    ...[options]: Key extends keyof TranslationsDictionary
      ? TranslationsDictionary[Key] extends [never]
        ? []
        : [args: TranslationsDictionary[Key], options?: TranslateOptions<Locales> | string | number]
      : []
  ) => string;

  // <Key extends TranslationKey>(key: Key, defaultMsg: string, options: TranslateOptions<Locales>): string;
  // <Key extends TranslationKey>(key: Key, plural: number, options: TranslateOptions<Locales>): string;
  // <Key extends TranslationKey>(key: Key, defaultMsg: string): string;
  // <Key extends TranslationKey>(key: Key, list: unknown[], options: TranslateOptions<Locales>): string;
  // <Key extends TranslationKey>(key: Key, list: unknown[], defaultMsg: string): string;
  // <Key extends TranslationKey>(key: Key, list: unknown[], plural: number): string;

  function useI18n<Options extends UseI18nOptions = UseI18nOptions>(
    options?: Options
  ): Omit<
    Composer<
      NonNullable<Options['messages']>,
      NonNullable<Options['datetimeFormats']>,
      NonNullable<Options['numberFormats']>,
      Options['locale'] extends unknown ? string : Options['locale']
    >,
    't'
  > & { t: TypedComposerTranslation<Options['locale'] extends unknown ? string : Options['locale']> };
}
