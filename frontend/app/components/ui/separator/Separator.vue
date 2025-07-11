<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core';
import { Separator, type SeparatorProps } from 'reka-ui';
import { computed, useSlots } from 'vue';

import type { HTMLAttributes } from 'vue';

import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<
    SeparatorProps & {
      class?: HTMLAttributes['class'];
    }
  >(),
  {
    orientation: 'horizontal',
    decorative: true,
    class: undefined,
  },
);

const delegatedProps = reactiveOmit(props, ['class']);
const slots = useSlots();

const hasSlot = computed(() => {
  const slot = slots.default?.();
  return !!(slot && slot.length);
});
const isHorizontal = computed(() => props.orientation === 'horizontal');
</script>

<template>
  <div
    v-if="hasSlot"
    :class="
      cn(
        'flex w-full items-center',
        isHorizontal ? 'flex-row' : 'h-full flex-col',
        props.class,
      )
    "
    data-slot="separator-root"
  >
    <Separator
      v-bind="delegatedProps"
      :class="cn('bg-border flex-1', isHorizontal ? 'h-px' : 'w-px')"
    />
    <span
      :class="
        cn(
          'text-muted-foreground mx-4 text-xs',
          isHorizontal ? 'whitespace-nowrap' : 'my-4',
        )
      "
      data-slot="separator-content"
    >
      <slot />
    </span>
    <Separator
      v-bind="delegatedProps"
      :class="cn('bg-border flex-1', isHorizontal ? 'h-px' : 'w-px')"
    />
  </div>

  <Separator
    v-else
    data-slot="separator-root"
    v-bind="delegatedProps"
    :class="
      cn(
        'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px',
        props.class,
      )
    "
  />
</template>
