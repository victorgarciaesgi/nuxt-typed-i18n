import type { EmptyObject } from 'type-fest';

/**
 * This is the inverse of isFilled. It will check if the value is in any way empty (including arrays and objects)
 *
 * isEmpty also acts as a type guard.
 *
 * @param value - the target value
 */
export function isEmpty(value: unknown): value is null | undefined | [] | EmptyObject {
  if (value === undefined || value === null) {
    return true;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime());
  } else if (Array.isArray(value)) {
    return value.length === 0;
  } else if (typeof value === 'object' && value != null) {
    return Object.keys(value).length === 0;
  }
  return !String(value).length;
}
