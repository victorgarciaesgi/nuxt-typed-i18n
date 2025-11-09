import type { UseI18nOptions } from 'vue-i18n';
import type { TranslationsDictionary } from './translations';
import type { TypedComposerTranslation } from './type-utils';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: TypedComposerTranslation<
      TranslationsDictionary,
      UseI18nOptions['locale'] extends unknown ? string : UseI18nOptions['locale']
    >;
  }
}

declare global {
  // @ts-ignore
  var $t: TypedComposerTranslation<
    TranslationsDictionary,
    UseI18nOptions['locale'] extends unknown ? string : UseI18nOptions['locale']
  >;
}

declare module 'vue' {
  interface ComponentCustomProperties {
    // @ts-ignore
    $t: TypedComposerTranslation<
      TranslationsDictionary,
      UseI18nOptions['locale'] extends unknown ? string : UseI18nOptions['locale']
    >;
  }
}
