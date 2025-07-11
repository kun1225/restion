<script setup lang="ts">
import AppSidebar from '@/components/app-sidebar/app-sidebar.vue';
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar';
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <div class="bg-background-light p-8">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
