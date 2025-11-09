export function isObject(obj: unknown): obj is Record<string, any> {
  if (obj && (obj instanceof Date || obj.constructor.name == 'File' || obj.constructor.name == 'FileList')) {
    return false;
  }
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}
