<template>
  <template v-if="!item.meta?.hidden">
    <!-- 有子菜单 -->
    <el-sub-menu v-if="item.hidden" :index="item.path.slice(1)">
      <template #title>
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>

      <el-menu-item-group v-for="(item1, index) in item.children" :key="index" :title="item1.meta?.title">
        <el-menu-item v-for="item2 in item1.children" :index="item2.path.slice(1)">{{ item2.meta?.title }}</el-menu-item>
      </el-menu-item-group>

    </el-sub-menu>

    <!-- 无子菜单 -->
    <el-menu-item v-else :index="item.path.slice(1)" @click="handleClick(item)">
      <el-icon v-if="item.meta?.icon">
        <component :is="item.meta.icon" />
      </el-icon>
      <template #title>{{ item.meta?.title }}</template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { type RouteMeta, useRouter } from 'vue-router';
import type { Component } from 'vue'
export interface AppRouteRecordRaw {
  path: string;
  name?: string | symbol;
  meta?: RouteMeta;
  component?: Component | string;
  children?: AppRouteRecordRaw[];
  redirect?: string;
  hidden: number
}

defineProps<{
  item: AppRouteRecordRaw
}>();

const router = useRouter();
const handleClick = (item: AppRouteRecordRaw) => {
  router.push(item.path);
};
</script>