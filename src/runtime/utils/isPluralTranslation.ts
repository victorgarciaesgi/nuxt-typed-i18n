const pluralRegex = /^(?!\s*\{[^}]*,\s*(?:plural|select|selectordinal)\b)\s*([^|]+?)\s*(?:\|\s*([^|]+?)\s*)+$/gi;

export function isPluralTranslation(value: string, parameters: (string | number)[]): boolean {
  return (
    pluralRegex.test(value) && (parameters.length ? parameters.includes('count') || parameters.includes('n') : true)
  );
}
