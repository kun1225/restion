<script setup lang="ts">
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar.vue';
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <!-- 主內容區域帶觸發按鈕 -->
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger class="-ml-1" />
        <div class="flex items-center gap-2">
          <h1 class="text-lg font-semibold">專注休息計時器</h1>
        </div>
      </header>

      <!-- 頁面內容 -->
      <div class="flex flex-1 flex-col gap-4 p-4">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
