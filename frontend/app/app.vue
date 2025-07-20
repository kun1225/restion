<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner';
import 'vue-sonner/style.css';
</script>

<template>
  <NuxtLoadingIndicator />
  <Toaster />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
