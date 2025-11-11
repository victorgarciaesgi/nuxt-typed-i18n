import { defineNuxtPlugin } from '#app';
import I18nT from '../components/I18nT';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('NuxtI18nT', I18nT);
});
