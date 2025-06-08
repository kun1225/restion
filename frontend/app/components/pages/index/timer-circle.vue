<script setup lang="ts">
import { computed } from 'vue';
import type { TimerPhase } from '../../../composables/useTimer';

const props = defineProps<{
  progress: number;
  focusDuration: number;
  remainingRestDuration: number;
  phase: TimerPhase;
  size?: number;
  stroke?: number;
}>();

const size = props.size ?? 220;
const stroke = props.stroke ?? 14;
const radius = computed(() => (size - stroke) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);

const formattedTime = computed(() => {
  if (props.phase === 'focus') {
    return formatTime(props.focusDuration);
  } else {
    return formatTime(props.remainingRestDuration);
  }
});

function formatTime(duration: number) {
  const m = Math.floor(duration / 60);
  const s = duration % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <svg :width="size" :height="size" class="block relative">
      <circle
        :r="radius"
        :cx="size / 2"
        :cy="size / 2"
        class="stroke-gray-200 dark:stroke-gray-700"
        :stroke-width="stroke"
        fill="none"
      />
      <circle
        :r="radius"
        :cx="size / 2"
        :cy="size / 2"
        :stroke="phase === 'focus' ? '#38bdf8' : '#34d399'"
        :stroke-width="stroke"
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="circumference * (1 - progress)"
        stroke-linecap="round"
        class="transition-all duration-300"
        style="transform: rotate(-90deg); transform-origin: 50% 50%"
      />
    </svg>
    <div
      class="absolute top-0 left-0 pointer-events-none flex flex-col items-center justify-center"
      :style="{ width: size + 'px', height: size + 'px', top: 0, left: 0 }"
    >
      <span class="text-4xl font-bold tabular-nums">{{ formattedTime }}</span>
      <span class="mt-1 text-sm text-gray-500 dark:text-gray-400 tracking-wide">
        {{ phase === 'focus' ? 'focusing' : 'resting' }}
      </span>
    </div>
  </div>
</template>
