<script setup lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import AppSidebarButtonLabel from './app-sidebar-button-label.vue';
import type { AppSidebarGroup } from '~~/types/type-app-sidebar';
import { useSidebar } from '@/components/ui/sidebar';

const props = defineProps<AppSidebarGroup>();
const { title, items } = toRefs(props);

const { open } = useSidebar();
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>{{ title }}</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        <template v-for="item in items" :key="item.title">
          <Collapsible
            v-if="item?.subItems && item?.subItems.length > 0"
            class="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger as-child>
                <SidebarMenuButton :tooltip="open ? undefined : item.title">
                  <component :is="item?.icon" />
                  <span>{{ item.title }}</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem
                    v-for="subItem in item.subItems"
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

          <SidebarMenuItem v-else>
            <SidebarMenuButton as-child :tooltip="item.title">
              <NuxtLink :to="item.url">
                <component :is="item.icon" />
                <AppSidebarButtonLabel :label="item.title" />
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </template>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
