import type { MatchedKey } from '../../../types/languages.types';

export function createMainTemplate(typedKeys: MatchedKey[], availableLocales: string[]) {
  function generateTypeParams(properties: MatchedKey) {
    const filteredParams = [...new Set(properties.params ?? [])];
    const paramaterType = `TranslationArg`;

    if (!filteredParams.length) {
      if (!properties.plural) {
        return 'KeyOptions<never>';
      } else {
        return `KeyOptions<{ count: ${paramaterType} } , true>`;
      }
    }
    let params: string = '';
    if (filteredParams.some((param) => typeof param === 'number')) {
      params = `[${filteredParams.map(() => `${paramaterType}`).join(', ')}]`;
    } else {
      params = `{${filteredParams.map((paramName) => `"${paramName}": ${paramaterType}`).join(',')}}`;
    }

    return `KeyOptions<${params} , ${properties.plural ?? false}>`;
  }

  const typedTranslationsKeys = typedKeys
    .map((params) => `"${params.name}": ${generateTypeParams(params)}`)
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
import type { KeyOptions, TranslationArg } from './type-utils';
export type TranslationsDictionary = {
  ${typedTranslationsKeys};
}
export type AvailableLocales = ${availableLocalesType};`;
  return typeTemplate;
}
