import IntlMessageFormat from 'intl-messageformat';
import type { ModuleOptions } from '../../../module';
import { extractParameters } from './extractParameters';
import type { MatchedKey } from '../../types';
import type { ExtractDefaultMessagesPayload } from '../../types/payloads';
import { createMainTemplate } from './templates';
import { isPluralTranslation } from '../../utils/isPluralTranslation';
import { isEmpty, isObject } from '../../utils';

function inferTranslationType({
  defaultLocaleFound,
  key,
  options,
  value,
}: {
  key: string;
  value: string;
  defaultLocaleFound: string;
  options: ModuleOptions;
}): MatchedKey {
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
    // If it fails, it's likely of html or Vue i18n syntax in the translation, not ICU
    // Fallback to classic regex check
    const matches = [...value.matchAll(/\{([^']+?)\}/gi)].map((match) => match[1]);
    const parameters = matches.filter((match): match is string => match !== null);
    const isPlural = isPluralTranslation(value, parameters);
    return { name: key, params: parameters, plural: isPlural };
  }
}

function createTypedKeys({
  defaultLocaleFound,
  parentKey,
  options,
  messages,
}: {
  parentKey?: string;
  messages: Record<string, string | Record<string, string>>;
  defaultLocaleFound: string;
  options: ModuleOptions;
}): MatchedKey[] {
  return Object.entries(messages).reduce((acc, [key, value]) => {
    if (isObject(value)) {
      if (isEmpty(value)) {
        return [];
      }
      return acc.concat(createTypedKeys({ defaultLocaleFound, parentKey: key, options, messages: value }));
    }
    return acc.concat(
      inferTranslationType({ defaultLocaleFound, key: parentKey ? `${parentKey}.${key}` : key, options, value })
    );
  }, [] as MatchedKey[]);
}

export function generateTypes({
  locales: { defaultLocaleFound = 'en-US', defaultMessages, availableLocales },
  options,
}: {
  locales: ExtractDefaultMessagesPayload;
  options: ModuleOptions;
}): string {
  const typedKeys = createTypedKeys({ defaultLocaleFound, options, messages: defaultMessages });
  return createMainTemplate(typedKeys, availableLocales);
}
