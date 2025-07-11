<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTimer } from '@/composables/useTimer';
import {
  TimerCircle,
  TimerControls,
  TimerSettings,
} from '~/components/pages/index';

definePageMeta({
  keepalive: true,
});

const timer = useTimer();

const {
  restRatio,
  isLooping,
  phase,
  isPaused,
  focusSeconds,
  restSeconds,
  progress,
  start,
  pause,
  skip,
} = timer;

const toggleLoop = () => {
  isLooping.value = !isLooping.value;
};
</script>

<template>
  <section class="flex h-full flex-col items-center justify-center">
    <TimerCircle
      :progress="progress"
      :focus-seconds="focusSeconds"
      :rest-seconds="restSeconds"
      :phase="phase"
      class="relative mb-4"
    />

    <TimerControls
      :is-paused="isPaused"
      :is-looping="isLooping"
      :phase="phase"
      :on-start="start"
      :on-pause="pause"
      :on-skip="skip"
      :on-toggle-loop="toggleLoop"
    />

    <!-- <TimerSettings
          :rest-ratio="restRatio"
          @update:rest-ratio="(val) => (restRatio = val)"
        /> -->

    <div class="mx-auto mt-12 text-center text-xs text-gray-400">
      <div>休息時間 = 專注時間 ÷ 比例</div>
    </div>
  </section>
</template>
