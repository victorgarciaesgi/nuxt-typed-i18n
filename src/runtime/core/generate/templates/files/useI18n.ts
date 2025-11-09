import type { TranslationsDictionary } from './translations';
import type { TypedComposerTranslation } from './type-utils';
import type { UseI18nOptions, Composer } from 'vue-i18n';

type TypedComposer = Omit<
  Composer<
    NonNullable<UseI18nOptions['messages']>,
    NonNullable<UseI18nOptions['datetimeFormats']>,
    NonNullable<UseI18nOptions['numberFormats']>,
    UseI18nOptions['locale'] extends unknown ? string : UseI18nOptions['locale']
  >,
  't'
> & {
  t: TypedComposerTranslation<
    TranslationsDictionary,
    UseI18nOptions['locale'] extends unknown ? string : UseI18nOptions['locale']
  >;
};

declare module 'vue-i18n' {
  function useI18n(options?: UseI18nOptions): TypedComposer;
}

declare module '#app' {
  interface NuxtApp {
    // @ts-ignore
    $i18n: TypedComposer;
  }
}
