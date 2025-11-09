import type { DefineSetupFnComponent, SlotsType, VNode, VNodeProps } from 'vue';
import type { TranslationsDictionary } from './translations';
import type { TranslationProps } from 'vue-i18n';

type TypedI18nTProps<Key extends keyof TranslationsDictionary> = TranslationProps & {
  keypath: Key;
} & (TranslationsDictionary[Key]['plural'] extends true ? { plural: number } : {});

type TypedI18nTSlots<Key extends keyof TranslationsDictionary> = TranslationsDictionary[Key]['args'] extends [...any[]]
  ? {
      default?: () => VNode[];
    }
  : TranslationsDictionary[Key]['args'] extends Record<string, any>
    ? {
        [K in keyof TranslationsDictionary[Key]['args']]: VNode[];
      }
    : {
        default?: () => VNode[];
      };

export type TypedI18nT = new <Key extends keyof TranslationsDictionary>(
  $props: VNodeProps & TypedI18nTProps<Key>
) => InstanceType<DefineSetupFnComponent<TypedI18nTProps<Key>, [], SlotsType<TypedI18nTSlots<Key>>>>;

declare module 'vue' {
  export interface GlobalComponents {
    // @ts-ignore
    'i18n-t': TypedI18nT;
    // @ts-ignore
    I18nT: TypedI18nT;
  }
}
