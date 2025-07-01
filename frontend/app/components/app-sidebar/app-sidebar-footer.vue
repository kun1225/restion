<script setup lang="ts">
import { useAuthStore } from '~~/stores/auth';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const authStore = useAuthStore();
</script>

<template>
  <template v-if="authStore.isLoggedIn">
    <DropdownMenu>
      <DropdownMenuTrigger
        as-child
        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <SidebarMenuButton>
          <Avatar class="size-6">
            <AvatarImage
              :src="authStore.user?.avatarUrl ?? ''"
              :alt="authStore.userName"
            />
            <AvatarFallback>{{ authStore.userInitial }}</AvatarFallback>
          </Avatar>
          <span
            class="group-data-[collapsible=icon]:blur-xs whitespace-nowrap transition-all ease-linear group-data-[collapsible=icon]:invisible group-data-[collapsible=icon]:opacity-0"
          >
            {{ authStore.userName }}
          </span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent class="w-2xs mb-4" align="center" side="right">
        <DropdownMenuLabel>
          <div class="flex flex-col gap-1">
            <p class="text-sm font-medium">
              {{ authStore.userName }}
            </p>
            <p class="text-muted-foreground text-xs">
              {{ authStore.user?.email }}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Icon name="lucide:user" class="mr-2 size-4" mode="svg" />
            <span>個人資料</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icon name="lucide:settings" class="mr-2 size-4" mode="svg" />
            <span>設定</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="authStore.logout">
          <Icon name="lucide:log-out" class="mr-2 size-4" mode="svg" />
          <span>登出</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </template>

  <template v-else>
    <SidebarMenuButton as-child>
      <NuxtLink to="/login">
        <Icon name="lucide:log-in" class="size-6" mode="svg" />
        <span
          class="group-data-[collapsible=icon]:blur-xs whitespace-nowrap transition-all ease-linear group-data-[collapsible=icon]:invisible group-data-[collapsible=icon]:opacity-0"
        >
          登入 / 註冊
        </span>
      </NuxtLink>
    </SidebarMenuButton>
  </template>
</template>
