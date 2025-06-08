<script setup lang="ts">
import { useTimer } from '@/composables/useTimer';
import TimerCircle from '~/components/pages/index/timer-circle.vue';
import TimerControls from '~/components/pages/index/timer-controls.vue';
import TimerSettings from '~/components/pages/index/timer-settings.vue';

const timer = useTimer();

const {
  restRatio,
  isLooping,
  phase,
  isPaused,
  isRunning,
  focusDuration,
  restDuration,
  remainingRestDuration,
  progress,
  start,
  pause,
  resume,
  reset,
  skip,
} = timer;

const toggleLoop = () => {
  isLooping.value = !isLooping.value;
};
</script>

<template>
  <section
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-800"
  >
    <div
      class="w-full max-w-md p-6 rounded-xl shadow-lg bg-white/80 dark:bg-gray-900/80 flex flex-col items-center"
    >
      <TimerCircle
        :progress="progress"
        :focus-duration="focusDuration"
        :remaining-rest-duration="remainingRestDuration"
        :phase="phase"
        class="relative mb-4"
      />

      <TimerControls
        :is-running="isRunning"
        :is-paused="isPaused"
        :is-looping="isLooping"
        :on-start="start"
        :on-pause="pause"
        :on-resume="resume"
        :on-reset="reset"
        :on-skip="skip"
        :on-toggle-loop="toggleLoop"
      />

      <TimerSettings
        :focus-duration="focusDuration"
        :rest-ratio="restRatio"
        @update:focus-duration="(val) => (focusDuration = val)"
        @update:rest-ratio="(val) => (restRatio = val)"
      />
      <div class="mt-6 text-xs text-gray-400 text-center">
        <div>休息時間 = 專注時間 ÷ 比例</div>
        <div>目前休息：{{ restDuration }} 分鐘</div>
      </div>
    </div>
  </section>
</template>
