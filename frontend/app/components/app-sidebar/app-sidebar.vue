<script setup lang="ts">
import {
  BarChart3,
  HelpCircle,
  Music,
  Settings,
  Timer,
  Users,
} from 'lucide-vue-next';

import AppSidebarFooter from './app-sidebar-footer.vue';
import AppSidebarGroup from './app-sidebar-group.vue';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const mainItems = [
  {
    title: '計時器',
    url: '/',
    icon: Timer,
  },
  {
    title: '統計分析',
    url: '/analytics',
    icon: BarChart3,
  },
];

const settingsItems = [
  {
    title: '功能設定',
    icon: Settings,
    url: '/settings',
  },
  {
    title: '媒體庫',
    icon: Music,
    url: '/media',
  },
];

const otherItems = [
  {
    title: '團隊協作',
    url: '/team',
    icon: Users,
  },
  {
    title: '說明文檔',
    url: '/help',
    icon: HelpCircle,
  },
];
</script>

<template>
  <Sidebar>
    <!-- Header -->
    <SidebarHeader class="relative">
      <SidebarMenuButton
        class="group-data-[collapsible=icon]:blur-xs w-fit text-lg blur-none transition-all ease-linear group-data-[collapsible=icon]:invisible group-data-[collapsible=icon]:opacity-0"
      >
        R
      </SidebarMenuButton>
      <SidebarTrigger
        class="border-border absolute right-2.5 top-1/2 -translate-y-1/2 border group-data-[collapsible=icon]:border-transparent"
      />
    </SidebarHeader>
    <SidebarSeparator />

    <SidebarContent>
      <!-- Main -->
      <AppSidebarGroup title="主要功能" :items="mainItems" />
      <SidebarSeparator />

      <!-- Settings  -->
      <AppSidebarGroup title="設定管理" :items="settingsItems" />
      <SidebarSeparator />

      <!-- Other -->
      <AppSidebarGroup title="其他" :items="otherItems" />
    </SidebarContent>

    <!-- Footer -->
    <SidebarFooter>
      <SidebarSeparator />
      <AppSidebarFooter />
    </SidebarFooter>
  </Sidebar>
</template>
