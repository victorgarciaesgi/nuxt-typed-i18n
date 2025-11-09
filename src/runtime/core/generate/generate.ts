import IntlMessageFormat from 'intl-messageformat';
import type { ModuleOptions } from '../../../module';
import { extractParameters } from './extractParameters';
import type { MatchedKey } from '../../types';
import type { ExtractDefaultMessagesPayload } from '../../types/payloads';
import { createMainTemplate } from './templates';
import { isPluralTranslation } from '../../utils/isPluralTranslation';

export function generateTypes({
  locales: { defaultLocaleFound = 'en-US', defaultMessages, availableLocales },
  options,
}: {
  locales: ExtractDefaultMessagesPayload;
  options: ModuleOptions;
}): string {
  const typedKeys: MatchedKey[] = Object.entries(defaultMessages).map(([key, value]) => {
    try {
      if (options.ignoreKeysParametersExtract?.includes(key)) {
        // Edge case where the date pattern regex is mistaken for a parameter
        return {
          name: key,
        };
      }
      const AST = new IntlMessageFormat(value, defaultLocaleFound, undefined, { ignoreTag: true }).getAst();
      const keyParameters = extractParameters(AST);
      const isPlural = isPluralTranslation(value, keyParameters);

      if (keyParameters.length) {
        return {
          name: key,
          params: keyParameters,
          plural: isPlural,
        };
      } else {
        return {
          name: key,
          plural: isPlural,
        };
      }
    } catch {
      // If it fails, it's likely of html in the translation, not ICU
      // Fallback to classic regex check
      const matches = [...value.matchAll(/\{(.*?)\}/g)].map((match) => match[1]);
      const parameters = matches.map((_, index) => index);
      return { name: key, params: parameters };
    }
  });

  return createMainTemplate(typedKeys, availableLocales);
}
