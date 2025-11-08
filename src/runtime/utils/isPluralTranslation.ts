const pluralRegex = /^(?!\s*\{[^}]*,\s*(?:plural|select|selectordinal)\b)\s*([^|]+?)\s*(?:\|\s*([^|]+?)\s*)+$/gi;

export function isPluralTranslation(value: string): boolean {
  return pluralRegex.test(value);
}
