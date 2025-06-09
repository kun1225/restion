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

// 主要功能菜單
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

// 設定菜單 - 支援多層級
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

// 其他功能
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
    <!-- 頭部 - Logo 區域 -->
    <SidebarHeader class="border-b">
      <div class="flex items-center gap-2 px-4 py-2">
        <Timer class="h-6 w-6 text-primary" />
        <span class="font-bold text-lg group-data-[collapsible=icon]:hidden">
          Restion
        </span>
      </div>
    </SidebarHeader>

    <SidebarContent>
      <!-- 主要功能區 -->
      <SidebarGroup>
        <SidebarGroupLabel>主要功能</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in mainItems" :key="item.title">
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

      <SidebarSeparator />

      <!-- 設定區 - 支援摺疊子菜單 -->
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

      <!-- 其他功能區 -->
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

    <!-- 底部 -->
    <SidebarFooter class="border-t">
      <div
        class="p-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden"
      >
        Restion v1.0.0
      </div>
    </SidebarFooter>
  </Sidebar>
</template>
