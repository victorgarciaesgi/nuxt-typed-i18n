export function isNumeric(value: string): boolean {
  if (typeof value !== 'string') return false;
  return !isNaN(value as unknown as number) && !isNaN(parseFloat(value));
}
