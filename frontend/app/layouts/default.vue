<script setup lang="ts">
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '~/components/app-sidebar/app-sidebar.vue';
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <slot />
    </SidebarInset>
  </SidebarProvider>
</template>
