<script setup lang="ts">
import { ChevronsLeft } from 'lucide-vue-next';

import { useSidebar } from './utils';

import type { HTMLAttributes } from 'vue';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';


const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const { toggleSidebar } = useSidebar();
</script>

<template>
  <Button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="ghost"
    size="icon"
    :class="cn('', props.class)"
    @click="toggleSidebar"
  >
    <ChevronsLeft
      class="size-6 transition-transform group-data-[collapsible=icon]:rotate-180"
    />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
