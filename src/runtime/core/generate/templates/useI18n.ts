import type { TranslateOptions } from 'vue-i18n';
import type { TranslationKey } from './type-utils';
import type { TranslationsDictionary } from './translations';

declare module 'vue-i18n' {
  interface TypedComposerTranslation<Locales = 'en-US'> {
    <Key extends TranslationKey>(
      key: Key,
      ...[options]: Key extends keyof TranslationsDictionary
        ? TranslationsDictionary[Key] extends [never]
          ? [options: TranslateOptions<Locales>]
          : [args: TranslationsDictionary[Key], options: TranslateOptions<Locales>]
        : [options: TranslateOptions<Locales>]
    ): string;
    <Key extends TranslationKey>(
      key: Key,
      ...[options]: Key extends keyof TranslationsDictionary
        ? TranslationsDictionary[Key] extends [never]
          ? [defaultMsg: string]
          : [args: TranslationsDictionary[Key], defaultMsg: string]
        : [defaultMsg: string]
    ): string;
    <Key extends TranslationKey>(
      key: Key,
      ...[options]: Key extends keyof TranslationsDictionary
        ? TranslationsDictionary[Key] extends [never]
          ? [plural: number]
          : [args: TranslationsDictionary[Key], plural: number]
        : [plural: number]
    ): string;
    <Key extends TranslationKey>(
      key: Key,
      ...[options]: Key extends keyof TranslationsDictionary
        ? TranslationsDictionary[Key] extends [never]
          ? [list: unknown[], options: TranslateOptions<Locales>]
          : [args: TranslationsDictionary[Key], list: unknown[], options: TranslateOptions<Locales>]
        : [list: unknown[], options: TranslateOptions<Locales>]
    ): string;
    <Key extends TranslationKey>(
      key: Key,
      ...[options]: Key extends keyof TranslationsDictionary
        ? TranslationsDictionary[Key] extends [never]
          ? [list: unknown[], defaultMsg: string]
          : [args: TranslationsDictionary[Key], list: unknown[], defaultMsg: string]
        : [list: unknown[], defaultMsg: string]
    ): string;
    <Key extends TranslationKey>(
      key: Key,
      ...[options]: Key extends keyof TranslationsDictionary
        ? TranslationsDictionary[Key] extends [never]
          ? [list: unknown[], plural: number]
          : [args: TranslationsDictionary[Key], list: unknown[], plural: number]
        : [list: unknown[], plural: number]
    ): string;
    <Key extends TranslationKey>(
      key: Key,
      ...[options]: Key extends keyof TranslationsDictionary
        ? TranslationsDictionary[Key] extends [never]
          ? []
          : [args: TranslationsDictionary[Key]]
        : []
    ): string;
  }

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
