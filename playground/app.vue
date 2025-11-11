<template>
  <div> Nuxt module playground! </div>
  <div>
    {{ $t('order.status', { orderId: 123, status: 1 }) }}
    {{ $t('actions.cancel', ['test', 'test2']) }}
    {{ $t('cart.items', { count: 1 }) }}
    {{ $t('cart.items', 1) }}
    {{ $t('hello', { count: 1 }) }}
  </div>

  Component:
  <div>
    <NuxtI18nT keypath="hello">
      <template #count>Coucou</template>
    </NuxtI18nT>
  </div>

  <!-- ❌ should error -->
  {{ $t('cart.items') }}
  {{ $t('order.status') }}
</template>

<script setup lang="ts">
import { useI18n } from '#imports';
import { type GlobalComponents } from 'vue';

type foo = GlobalComponents['NuxtI18nT'];

const { t } = useI18n();
const { $i18n } = useNuxtApp();

// TODO handle nested keys

t('order.status', { orderId: 123, status: 1 });
t('cart.items', { count: 1 });
t('cart.items', 1);
t('files.selected', { count: 1, name: 'test' });
t('actions.cancel', ['test', 'test2']);
$i18n.t('hello', { count: 1 });

// ❌ should error
t('cart.items'); // No plural
t('order.status'); // No arguments
t('actions.cancel', 1);
t('search.noResults');
$i18n.t('hello');
</script>
