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
    const filePath = path.join(nuxt.options.rootDir, 'i18n', langDir, fileName);
    const fileContent = readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent) as Record<string, string>;
  } catch (error) {
    throw new Error(`[nuxt-typed-i18n] Failed to read locale file: ${fileName}`, { cause: error });
  }
}
