<script setup lang="ts">
import { Primitive } from 'reka-ui';

import type { PrimitiveProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';

import { cn } from '@/lib/utils';

const props = defineProps<
  PrimitiveProps & {
    class?: HTMLAttributes['class'];
  }
>();
</script>

<template>
  <Primitive
    data-slot="sidebar-group-label"
    data-sidebar="group-label"
    :as="as"
    :as-child="asChild"
    :class="
      cn(
        'text-sidebar-foreground/70 ring-sidebar-ring outline-hidden flex h-12 shrink-0 items-center rounded-md px-2 text-xs font-medium blur-none transition-[margin,opacity,visibility,filter] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:blur-xs group-data-[collapsible=icon]:invisible group-data-[collapsible=icon]:-mt-12 group-data-[collapsible=icon]:opacity-0',
        props.class,
      )
    "
  >
    <slot />
  </Primitive>
</template>
