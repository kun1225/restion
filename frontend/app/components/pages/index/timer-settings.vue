<script setup lang="ts">
defineProps<{
  focusDuration: number;
  restRatio: number;
}>();
const emit = defineEmits<{
  (e: 'update:focusDuration' | 'update:restRatio', value: number): void;
}>();

const onRestInput = (e: Event) => {
  const val = Number((e.target as HTMLInputElement).value);
  if (val >= 1 && val <= 20) emit('update:restRatio', val);
};
</script>

<template>
  <div class="flex flex-col gap-6 w-full max-w-xs mx-auto mt-6">
    <div>
      <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
        >休息比率（專注 ÷ 比例 = 休息）</label
      >
      <div class="flex items-center gap-3">
        <input
          type="range"
          min="1"
          max="20"
          :value="restRatio"
          class="w-full accent-green-400"
          @input="onRestInput($event)"
        />
        <input
          type="number"
          min="1"
          max="20"
          :value="restRatio"
          class="w-16 px-2 py-1 border rounded text-center dark:bg-gray-800 dark:border-gray-600"
          @input="onRestInput($event)"
        />
      </div>
    </div>
  </div>
</template>
