<script setup lang="ts">
import { Timer, CheckCircle, TrendingUp } from 'lucide-vue-next';

// 頁面標題設定
useHead({
  title: '統計分析 - Restion',
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">統計分析</h2>
      <p class="text-muted-foreground">查看您的專注時間和休息品質統計</p>
    </div>

    <!-- 快速統計卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="rounded-lg border bg-card p-6">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium">今日專注時間</h3>
          <Timer class="h-4 w-4 text-muted-foreground" />
        </div>
        <div class="mt-2">
          <div class="text-2xl font-bold">2.5 小時</div>
          <p class="text-xs text-muted-foreground">+20.1% 比昨天</p>
        </div>
      </div>

      <div class="rounded-lg border bg-card p-6">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium">完成專注次數</h3>
          <CheckCircle class="h-4 w-4 text-muted-foreground" />
        </div>
        <div class="mt-2">
          <div class="text-2xl font-bold">5 次</div>
          <p class="text-xs text-muted-foreground">平均 30 分鐘/次</p>
        </div>
      </div>

      <div class="rounded-lg border bg-card p-6">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium">休息效率</h3>
          <TrendingUp class="h-4 w-4 text-muted-foreground" />
        </div>
        <div class="mt-2">
          <div class="text-2xl font-bold">92%</div>
          <p class="text-xs text-muted-foreground">比例設定 6:1</p>
        </div>
      </div>
    </div>

    <!-- 圖表區域 placeholder -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="rounded-lg border bg-card p-6">
        <h3 class="text-lg font-semibold mb-4">每週專注趨勢</h3>
        <div class="h-64 bg-muted rounded flex items-center justify-center">
          <p class="text-muted-foreground">圖表組件待實作</p>
        </div>
      </div>

      <div class="rounded-lg border bg-card p-6">
        <h3 class="text-lg font-semibold mb-4">專注vs休息比例</h3>
        <div class="h-64 bg-muted rounded flex items-center justify-center">
          <p class="text-muted-foreground">圓餅圖待實作</p>
        </div>
      </div>
    </div>
  </div>
</template>
