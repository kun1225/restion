<script setup lang="ts">
import { useTimer } from '@/composables/useTimer';
import {
  TimerCircle,
  TimerControls,
  TimerSettings,
} from '~/components/pages/index';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
  <section class="bg-background-light flex items-center justify-center">
    <Card class="min-w-1/2 w-[400px]">
      <CardHeader>
        <CardTitle class="sr-only">Timer</CardTitle>
        <CardDescription class="sr-only">
          {{ focusDuration }} 分鐘專注，{{ restDuration }} 分鐘休息
        </CardDescription>
      </CardHeader>

      <CardContent>
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

        <CardFooter>
          <div class="mt-6 text-center text-xs text-gray-400">
            <div>休息時間 = 專注時間 ÷ 比例</div>
            <div>目前休息：{{ restDuration }} 分鐘</div>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  </section>
</template>
