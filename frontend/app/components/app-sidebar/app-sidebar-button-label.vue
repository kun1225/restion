<script setup lang="ts">
const props = defineProps<{
  label: string;
}>();
</script>

<template>
  <span
    class="visible opacity-100 transition duration-300 group-data-[collapsible=icon]:opacity-0"
    >{{ props.label }}</span
  >
</template>
