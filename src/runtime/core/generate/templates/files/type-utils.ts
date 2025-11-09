import type { TranslateOptions } from 'vue-i18n';
import type { TranslationsDictionary } from './translations';

export interface TypedComposerTranslation<
  Translations extends Record<string, KeyOptions<any, any>> = {},
  Locales = 'en-US',
> {
  <Key extends keyof Translations>(key: Key, ...[options]: ProcessKeyOptions<Translations, Key, [], []>): string;
  <Key extends keyof Translations>(
    key: Key,
    ...[options]: ProcessKeyOptions<Translations, Key, [], [options: TranslateOptions<Locales>]>
  ): string;
  <Key extends keyof Translations>(
    key: Key,
    ...[options]: ProcessKeyOptions<Translations, Key, [], [defaultMsg: string]>
  ): string;
  <Key extends keyof Translations>(
    key: Key,
    ...[options]: ProcessKeyOptions<Translations, Key, [list: unknown[]], [options: TranslateOptions<Locales>]>
  ): string;
  <Key extends keyof Translations>(
    key: Key,
    ...[options]: ProcessKeyOptions<Translations, Key, [list: unknown[]], [defaultMsg: string]>
  ): string;
  <Key extends keyof Translations>(
    key: Key,
    ...[options]: ProcessKeyOptions<Translations, Key, [list: unknown[]], []>
  ): string;
}

type ProcessKeyOptions<
  Translations extends Record<string, KeyOptions<any, any>>,
  Key extends keyof Translations,
  TPRefixArgs extends [...any[]] = [],
  TAdditionalArgs extends [...any[]] = [],
> = Key extends keyof Translations
  ? [Translations[Key]['args']] extends [never]
    ? TAdditionalArgs
    : Translations[Key]['plural'] extends true
      ?
          | [...TPRefixArgs, plural: number, ...TAdditionalArgs]
          | [...TPRefixArgs, named: Translations[Key]['args'], ...TAdditionalArgs]
      : [named: Translations[Key]['args'], ...TAdditionalArgs]
  : [...TPRefixArgs, ...TAdditionalArgs];

export type TupleIndices<T extends readonly any[]> =
  Extract<keyof T, `${number}`> extends `${infer N extends number}` ? N : never;

export type TranslationArg = string | number | boolean | Date | undefined | null;

export type KeyOptions<Args extends Record<string, any> | never = never, Plural extends boolean = false> = {
  args: Args;
  plural: Plural;
};

export type TranslationKey = keyof TranslationsDictionary;

/**
 * Same as TranslationKey type, but allow string for apps that still don't have typechecking.
 * Useful for shared components/composables
 */
export type TranslationParameters<TKey extends keyof TranslationsDictionary> = TKey extends keyof TranslationsDictionary
  ? TranslationsDictionary[TKey] extends [never]
    ? any
    : TranslationsDictionary[TKey] extends [...any[]]
      ? TranslationsDictionary[TKey] | Record<TupleIndices<TranslationsDictionary[TKey]>, TranslationArg>
      : TranslationsDictionary[TKey]
  : any;

/**
 * Type utils to add a glob of translation keys as a type property
 * Ex: `const foo: TranslationKeyPattern<"admin.*"> = "admin.x.foo" `
 */
export type TranslationKeyPattern<T extends `${string}*${string}` = never> = [T] extends [never]
  ? TranslationKey
  : T extends `${infer P}*`
    ? Extract<keyof TranslationsDictionary, `${P}${string}`>
    : T extends `${infer P}*${infer S}`
      ? Extract<keyof TranslationsDictionary, `${P}${string}${S}`>
      : T extends `*${infer S}`
        ? Extract<keyof TranslationsDictionary, `${string}${S}`>
        : Extract<keyof TranslationsDictionary, T>;

/**
 * Type util that extracts possibles translation suffixes from a key pattern
 * Ex: `const foo: TranslationKeySuffix<"project.mission.*"> = "title" `
 */
export type TranslationKeySuffix<T extends `${string}.*`> = T extends `${infer S}.*`
  ? Extract<keyof TranslationsDictionary, `${S}.${string}`> extends `${S}.${infer U}`
    ? U
    : never
  : never;

/**
 * Type util that extracts possibles translation prefixes from a key pattern
 * Ex: `const foo: TranslationKeyPrefix<"*.label"> = "dashboard.layout" `
 */
export type TranslationKeyPrefix<T extends `*.${string}`> = T extends `*.${infer P}`
  ? Extract<keyof TranslationsDictionary, `${string}.${P}`> extends `${infer U}.${P}`
    ? U
    : never
  : never;

/**
 * Type util that extracts possibles translation words from a key pattern
 * Ex: `const foo: TranslationKeyPrefix<"messenger.header.*.label"> = "user" `
 */
export type TranslationKeyPart<T extends `${string}.*.${string}`> = T extends `${infer S}.*.${infer E}`
  ? Extract<keyof TranslationsDictionary, `${S}.${string}.${E}`> extends `${S}.${infer U extends string}.${E}`
    ? U
    : never
  : never;

export type CommonKeyRecord = Record<string, TranslationArg[] | Record<string, any>>;

// -- t function --

/**
 * function definition for simple arguments checks, will not report errors when too much arguments are passed
 */
export interface TypedTFunction<TAllowedKeys extends PropertyKey, TKeysRecord extends CommonKeyRecord> {
  <TKey extends TAllowedKeys>(
    keyName: TKey,
    ...[params]: TKey extends keyof TKeysRecord
      ? TKeysRecord[TKey] extends [never]
        ? [...never]
        : [TKeysRecord[TKey]]
      : [...never]
  ): string;
}
