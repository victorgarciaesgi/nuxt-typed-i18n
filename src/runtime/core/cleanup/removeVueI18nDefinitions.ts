import { createResolver } from '@nuxt/kit';
import { existsSync, readFileSync, writeFileSync } from 'fs';

type RemoveNuxtDefinitionsOptions = {
  rootDir: string;
};

export async function removeVueI18nDefinitions({ rootDir }: RemoveNuxtDefinitionsOptions): Promise<void> {
  const { resolvePath } = createResolver(rootDir);

  try {
    // This will properly resolve through pnpm symlinks
    const vueI18nFilePath = await resolvePath('vue-i18n/dist/vue-i18n.d.ts');

    console.log('vueI18nFilePath', vueI18nFilePath);
    if (existsSync(vueI18nFilePath)) {
      const componentDefinitions = readFileSync(vueI18nFilePath, {
        encoding: 'utf8',
      });
      const cleanedDefinitions = componentDefinitions.replace(
        /\['i18n-t'\]: typeof Translation|\['I18nT'\]: typeof Translation/gm,
        ''
      );

      console.log(`${vueI18nFilePath}.test`);

      writeFileSync(vueI18nFilePath, cleanedDefinitions, 'utf-8');
    }
  } catch (error) {
    console.error('[nuxt-typed-i18n] Failed to resolve vue-i18n path:', error);
  }
}
