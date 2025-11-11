export const GLOBAL_DECLARATIONS = /* typescript */ `

import type { UseI18nOptions } from 'vue-i18n';
import type { TypedComposerTranslation, TypedComposer } from './type-utils';
import type { TranslationsDictionary } from './translations';
import type { TypedI18nT } from './i18n-component';

declare module 'vue-i18n' {
  function useI18n(options?: UseI18nOptions): TypedComposer;
}

declare module '#app' {
  interface NuxtApp {
    $i18n: TypedComposer;
  }
}

declare module 'vue' {
  interface GlobalComponents {
    NuxtI18nT: TypedI18nT;
  }
}

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

`;
