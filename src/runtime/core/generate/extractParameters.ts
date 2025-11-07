import { TYPE, type MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import { isNumeric } from '../../utils';

/**
 * Extract parameters from a translation message
 */
export function extractParameters(treeList: MessageFormatElement[]): (string | number)[] {
  return treeList
    .filter((format) => format.type !== TYPE.literal && 'value' in format)
    .reduce(
      (acc, format) => {
        if (format.type === TYPE.tag) {
          // Handle cases like <b>{0}</b>
          return acc.concat(...extractParameters(format.children));
        } else if (format.type === TYPE.select || format.type === TYPE.plural) {
          const children = Object.entries(format.options)
            .map(([_, { value }]) => value)
            .flat();
          return acc.concat([format.value, ...extractParameters(children)]);
        } else {
          return acc.concat([isNumeric(format.value) ? +format.value : format.value]);
        }
      },
      [] as (string | number)[]
    );
}
