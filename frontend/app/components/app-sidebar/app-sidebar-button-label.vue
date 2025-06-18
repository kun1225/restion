<script setup lang="ts">
const props = defineProps<{
  label: string;
}>();
</script>

<template>
  <span
    class="group-data-[collapsible=icon]:blur-xs visible opacity-100 transition ease-linear group-data-[collapsible=icon]:opacity-0"
    >{{ props.label }}</span
  >
</template>
