<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core';
import { Label, type LabelProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import { cn } from '@/lib/utils';

const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
  <Label
    data-slot="label"
    v-bind="delegatedProps"
    :class="
      cn(
        'flex cursor-pointer select-none items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
        props.class,
      )
    "
  >
    <slot />
  </Label>
</template>
