<script lang="ts" setup>
import { useId } from 'reka-ui';
import { type HTMLAttributes, provide } from 'vue';

import { FORM_ITEM_INJECTION_KEY } from './injectionKeys';

import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const id = useId();
provide(FORM_ITEM_INJECTION_KEY, id);
</script>

<template>
  <div data-slot="form-item" :class="cn('flex flex-col gap-3', props.class)">
    <slot />
  </div>
</template>
