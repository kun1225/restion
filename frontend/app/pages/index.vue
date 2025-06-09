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
  <section class="flex h-full items-center justify-center">
    <Card class="min-w-1/2 w-[400px]">
      <CardHeader>
        <CardTitle class="sr-only">Timer</CardTitle>
        <CardDescription class="sr-only">
          {{ phase === 'focus' ? 'is focusing' : 'is resting' }}
        </CardDescription>
      </CardHeader>

      <CardContent>
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

        <CardFooter>
          <div class="mx-auto mt-6 text-center text-xs text-gray-400">
            <div>休息時間 = 專注時間 ÷ 比例</div>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  </section>
</template>
