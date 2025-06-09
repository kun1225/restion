<script setup lang="ts">
const props = defineProps<{
  label: string;
}>();
</script>

<template>
  <span
    class="transition-[opacity,visibility] group-data-[collapsible=icon]:invisible group-data-[collapsible=icon]:opacity-0"
    >{{ label }}</span
  >
</template>
