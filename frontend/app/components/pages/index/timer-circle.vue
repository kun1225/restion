<script setup lang="ts">
import { computed, watch } from 'vue';
import type { TimerPhase } from '../../../composables/useTimer';

const props = defineProps<{
  progress: number;
  focusSeconds: number;
  restSeconds: number;
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
    return formatTimeFromSeconds(props.focusSeconds);
  } else {
    return formatTimeFromSeconds(props.restSeconds);
  }
});

function formatTimeFromSeconds(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
</script>

<template>
  <div class="grid place-items-center">
    <svg
      :width="size"
      :height="size"
      class="relative col-[1/2] row-[1/2] block"
    >
      <circle
        :r="radius"
        :cx="size / 2"
        :cy="size / 2"
        class="stroke-border"
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
        :stroke-dashoffset="circumference * progress"
        stroke-linecap="round"
        class="stroke-primary transition-all duration-300"
        style="transform: rotate(-90deg); transform-origin: 50% 50%"
      />
    </svg>

    <div
      class="pointer-events-none col-[1/2] row-[1/2] flex flex-col items-center justify-center"
      :style="{ width: size + 'px', height: size + 'px', top: 0, left: 0 }"
    >
      <span class="mb-1 tracking-wide">
        {{ phase === 'focus' ? 'focusing' : 'resting' }}
      </span>
      <span class="text-4xl font-bold tabular-nums">{{ formattedTime }}</span>
    </div>
  </div>
</template>
