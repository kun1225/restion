<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <main
    data-slot="sidebar-inset"
    :class="
      cn(
        'bg-background min-h-[calc(100svh - var(--spacing) * 6)] relative flex w-full flex-1 flex-col overflow-hidden transition-[margin]',
        '[&>*]:h-full',
        'md:peer-data-[variant=inset]:m-3 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm',
        props.class,
      )
    "
  >
    <slot />
  </main>
</template>
