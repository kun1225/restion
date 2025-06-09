<script setup lang="ts">
import { SidebarProvider, SidebarInset } from '~/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar/app-sidebar.vue';
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
