<template>
  <div> Nuxt module playground! </div>
  {{ $t('order.status', { orderId: 123, status: 1 }) }}
  {{ $t('actions.cancel') }}
  {{ $t('cart.items', { count: 1 }) }}
  {{ $t('cart.items', 1) }}

  // ❌ should error
  {{ $t('cart.items') }}
  {{ $t('order.status') }}
</template>

<script setup lang="ts">
import { useI18n } from '#imports';
const { t } = useI18n();
// TODO handle nested keys

t('order.status', { orderId: 123, status: 1 });
t('actions.cancel');
t('cart.items', { count: 1 });
t('cart.items', 1);
t('files.selected', { count: 1, name: 'test' });
t('search.noResults', { n: 1 });

// ❌ should error
t('cart.items'); // No plural
t('order.status'); // No arguments
t('actions.cancel', 1);
t('search.noResults');
</script>
