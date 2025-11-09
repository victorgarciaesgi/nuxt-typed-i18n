import type { KeyOptions } from './type-utils';

// Keep this empty, it's a mock for local file
export type TranslationsDictionary = Record<string, KeyOptions<Record<string, any> | never, boolean>>;
export type AvailableLocales = '';
