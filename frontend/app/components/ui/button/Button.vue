<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'reka-ui';

import { type ButtonVariants, buttonVariants } from '.';

import type { HTMLAttributes } from 'vue';

import { cn } from '~/lib/utils';


interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
  class?: HTMLAttributes['class'];
  tooltip?: string;
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  variant: 'default',
  size: 'default',
  class: '',
});
</script>

<template>
  <Primitive
    data-slot="button"
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
