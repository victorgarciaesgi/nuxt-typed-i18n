import { readFileSync } from 'fs';
import type { Nuxt } from 'nuxt/schema';
import path from 'path';

export function extractContentFromFile({
  fileName,
  langDir = '',
  nuxt,
}: {
  fileName: string;
  langDir?: string;
  nuxt: Nuxt;
}): Record<string, any> {
  try {
    const fileExtension = path.extname(fileName).toLowerCase();
    if (fileExtension === '.json') {
      return JSON.parse(readFileSync(path.join(nuxt.options.rootDir, langDir, fileName), 'utf-8')) as Record<
        string,
        string
      >;
    } else {
      throw new Error(`[nuxt-typed-i18n] Unsupported file extension: ${fileExtension}`);
    }
  } catch (error) {
    throw new Error(`[nuxt-typed-i18n] Failed to read locale file: ${fileName}`, { cause: error });
  }
}
