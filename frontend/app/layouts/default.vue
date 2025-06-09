<script setup lang="ts">
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar.vue';
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <!-- 頁面內容 -->

      <slot />
    </SidebarInset>
  </SidebarProvider>
</template>
