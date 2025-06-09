import type { Component } from 'vue';

export type AppSidebarGroupSubItem = {
  title: string;
  icon?: Component;
  url: string;
};

export type AppSidebarGroupItem = {
  title: string;
  icon: Component;
  url: string;
  subItems?: AppSidebarGroupSubItem[];
};

export type AppSidebarGroup = {
  title: string;
  items?: AppSidebarGroupItem[];
};
