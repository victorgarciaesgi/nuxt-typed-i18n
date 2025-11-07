<template>
  <div> Nuxt module playground! </div>
</template>

<script setup lang="ts">
import { useI18n } from '#imports';
const { t } = useI18n();
// TODO handle nested keys

t('order.status', { orderId: 123, status: 1 });
t('actions.cancel');
</script>
