<script setup lang="ts">
import { Button } from '~/components/ui/button';

const props = defineProps<{
  isRunning: boolean;
  isPaused: boolean;
  isLooping: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
  onToggleLoop: () => void;
}>();

const { isRunning, isPaused, onStart, onPause, onResume, onReset, onSkip } = toRefs(props);
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center justify-center mt-6">
    <Button v-if="isPaused" aria-label="Start" @click="onStart">Start</Button>
    <Button v-else aria-label="Pause" @click="onPause">Pause</Button>
    <Button v-if="isPaused && !isRunning" aria-label="Resume" @click="onResume">Resume</Button>
    <Button aria-label="Reset" @click="onReset">Reset</Button>
    <Button aria-label="Skip" @click="onSkip">Skip</Button>
  </div>
</template>
