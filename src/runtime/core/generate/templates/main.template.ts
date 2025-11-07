import type { MatchedKey } from '../../../types/languages.types';

export function createMainTemplate(typedKeys: MatchedKey[], availableLocales: string[]) {
  function generateTypeParams(params?: (string | number)[]) {
    const filteredParams = [...new Set(params ?? [])];
    if (!filteredParams.length) {
      return 'never';
    }
    const paramaterType = `TranslationArg`;
    if (filteredParams.some((param) => typeof param === 'number')) {
      return `[${filteredParams.map(() => `${paramaterType}`).join(', ')}]`;
    } else {
      return `{${filteredParams.map((paramName) => `"${paramName}": ${paramaterType}`).join(',')}}`;
    }
  }

  const typedTranslationsKeys = typedKeys
    .map(({ name, params }) => `"${name}": ${generateTypeParams(params)}`)
    .join(';\n  ');

  const availableLocalesType = availableLocales
    .filter((locale) => !!locale)
    .map((locale) => `"${locale}"`)
    .join(' | ');
  /**
   * The expected type is `string | number | undefined` because too many places have unchecked condition when using translations parameters
   * Types are exported here because weirdly Nuxt can't compile the generics with addTemplate
   */
  const typeTemplate = `
export type TranslationsDictionary = {
  ${typedTranslationsKeys};
}
export type AvailableLocales = ${availableLocalesType};`;
  return typeTemplate;
}

export function createIndexTemplate() {
  return `export * from './translations';
export * from './t.global.types';
export * from './type-utils';`;
}
