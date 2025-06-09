<script setup lang="ts">
import {
  Timer,
  Settings,
  Music,
  BarChart3,
  Bell,
  Users,
  HelpCircle,
} from 'lucide-vue-next';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

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
    title: '計時設定',
    icon: Settings,
    items: [
      {
        title: '專注時間',
        url: '/settings/focus-time',
      },
      {
        title: '休息比例',
        url: '/settings/rest-ratio',
      },
    ],
  },
  {
    title: '提醒設定',
    icon: Bell,
    items: [
      {
        title: '間隔提醒',
        url: '/settings/interval-reminder',
      },
      {
        title: '任務提醒',
        url: '/settings/task-reminder',
      },
    ],
  },
  {
    title: '媒體庫',
    icon: Music,
    items: [
      {
        title: '背景音樂',
        url: '/media/music',
      },
      {
        title: '背景圖片',
        url: '/media/images',
      },
    ],
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
        class="w-fit text-lg transition-all group-data-[collapsible=icon]:invisible group-data-[collapsible=icon]:opacity-0"
      >
        R
      </SidebarMenuButton>
      <SidebarTrigger
        class="absolute right-1 top-1/2 -translate-y-1/2 border group-data-[collapsible=icon]:border-transparent"
      />
    </SidebarHeader>
    <SidebarSeparator />

    <SidebarContent>
      <!-- Main -->
      <SidebarGroup>
        <SidebarGroupLabel>主要功能</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in mainItems" :key="item.title">
              <SidebarMenuButton as-child>
                <NuxtLink :to="item.url">
                  <component :is="item.icon" />
                  <span
                    class="transition-opacity group-data-[collapsible=icon]:opacity-0"
                    >{{ item.title }}</span
                  >
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarSeparator />

      <!-- Settings  -->
      <SidebarGroup>
        <SidebarGroupLabel>設定管理</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <Collapsible
              v-for="item in settingsItems"
              :key="item.title"
              class="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger as-child>
                  <SidebarMenuButton>
                    <component :is="item.icon" class="h-4 w-4" />
                    <span>{{ item.title }}</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem
                      v-for="subItem in item.items"
                      :key="subItem.title"
                    >
                      <SidebarMenuSubButton as-child>
                        <NuxtLink :to="subItem.url">
                          <span>{{ subItem.title }}</span>
                        </NuxtLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarSeparator />

      <!-- Other -->
      <SidebarGroup>
        <SidebarGroupLabel>其他</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in otherItems" :key="item.title">
              <SidebarMenuButton as-child>
                <NuxtLink :to="item.url">
                  <component :is="item.icon" class="h-4 w-4" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <!-- Footer -->
    <SidebarFooter class="border-t">
      <div
        class="text-muted-foreground p-2 text-xs group-data-[collapsible=icon]:hidden"
      >
        Restion v1.0.0
      </div>
    </SidebarFooter>
  </Sidebar>
</template>
