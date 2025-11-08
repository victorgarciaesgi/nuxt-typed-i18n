import type { TranslationsDictionary } from './translations';
import type { TypedComposerTranslation } from './type-utils';

declare module 'vue-i18n' {
  function useI18n<Options extends UseI18nOptions = UseI18nOptions>(
    options?: Options
  ): Omit<
    Composer<
      NonNullable<Options['messages']>,
      NonNullable<Options['datetimeFormats']>,
      NonNullable<Options['numberFormats']>,
      Options['locale'] extends unknown ? string : Options['locale']
    >,
    't'
  > & {
    t: TypedComposerTranslation<TranslationsDictionary, Options['locale'] extends unknown ? string : Options['locale']>;
  };
}
