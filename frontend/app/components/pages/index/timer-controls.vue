<script setup lang="ts">
import { Button } from '~/components/ui/button';
import type { TimerPhase } from '~/composables/useTimer';

const props = defineProps<{
  isRunning: boolean;
  isPaused: boolean;
  isLooping: boolean;
  phase: TimerPhase;
  focusDuration: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
  onFinishFocus: () => void;
  onToggleLoop: () => void;
}>();
</script>

<template>
  <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
    <!-- Start button - only show when not running -->
    <Button v-if="!props.isRunning" aria-label="Start" @click="props.onStart">
      {{ props.phase === 'focus' ? 'Start Focus' : 'Start Rest' }}
    </Button>

    <!-- Pause button - only show when running and not paused -->
    <Button
      v-if="props.isRunning && !props.isPaused"
      aria-label="Pause"
      @click="props.onPause"
    >
      Pause
    </Button>

    <!-- Resume button - only show when paused but still running -->
    <Button
      v-if="props.isPaused && props.isRunning"
      aria-label="Resume"
      @click="props.onResume"
    >
      Resume
    </Button>

    <!-- Finish Focus button - only show during focus phase when there's focus time -->
    <Button
      v-if="props.phase === 'focus' && props.focusDuration > 0"
      aria-label="Finish Focus"
      variant="secondary"
      @click="props.onFinishFocus"
    >
      Finish Focus
    </Button>

    <!-- Reset button - always available -->
    <Button aria-label="Reset" variant="outline" @click="props.onReset">
      Reset
    </Button>

    <!-- Skip button - context-sensitive label -->
    <Button aria-label="Skip" variant="outline" @click="props.onSkip">
      {{ props.phase === 'focus' ? 'Skip to Rest' : 'Skip Rest' }}
    </Button>

    <!-- Loop toggle button -->
    <Button
      :variant="props.isLooping ? 'default' : 'outline'"
      aria-label="Toggle Loop"
      @click="props.onToggleLoop"
    >
      {{ props.isLooping ? 'Loop On' : 'Loop Off' }}
    </Button>
  </div>
</template>
