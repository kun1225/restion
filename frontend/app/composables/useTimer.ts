import { ref, computed, watch, onUnmounted } from 'vue';
import { useIntervalFn } from '@vueuse/core';

export type TimerPhase = 'focus' | 'rest';

export const useTimer = () => {
  // settings
  const restRatio = ref(5); // default 5:1
  const isLooping = ref(true);

  // states
  const focusSeconds = ref(0); // total focus seconds
  const phase = ref<TimerPhase>('focus');
  const isPaused = ref(true);
  const isRunning = computed(() => !isPaused.value);
  const isFocusing = computed(() => phase.value === 'focus');
  const isResting = computed(() => phase.value === 'rest');

  // time calculation in minutes
  const focusDuration = computed(() => Math.floor(focusSeconds.value / 60));
  const restDuration = computed(() =>
    Math.max(1, Math.round(focusDuration.value / restRatio.value)),
  );

  const restSeconds = ref(0);
  const remainingRestSeconds = computed(() => {
    const totalRestSeconds = restDuration.value * 60;
    return Math.max(0, totalRestSeconds - restSeconds.value);
  });

  // progress percentage
  const progress = computed(() => {
    if (phase.value === 'focus') {
      // For focus phase, we don't show progress since there's no predefined duration
      return 0;
    } else {
      // For rest phase, show countdown progress
      const totalRestSeconds = restDuration.value * 60;
      if (totalRestSeconds === 0) return 0;
      return Math.max(0, restSeconds.value / totalRestSeconds);
    }
  });

  // countdown timer
  const { pause, resume } = useIntervalFn(
    () => {
      if (phase.value === 'focus') {
        focusSeconds.value += 1;
      } else if (phase.value === 'rest') {
        restSeconds.value += 1;

        // Check if rest period is finished
        const totalRestSeconds = restDuration.value * 60;
        if (restSeconds.value >= totalRestSeconds) {
          handleRestComplete();
        }
      }
    },
    1000,
    { immediate: false },
  );

  const handleRestComplete = () => {
    if (isLooping.value) {
      // Start new focus session
      startFocusPhase();
    } else {
      // Stop the timer
      isPaused.value = true;
      phase.value = 'focus';
    }
  };

  const startFocusPhase = () => {
    phase.value = 'focus';
    focusSeconds.value = 0;
    isPaused.value = false;
  };

  const startRestPhase = () => {
    if (focusDuration.value === 0) return; // Can't rest without focus time

    phase.value = 'rest';
    restSeconds.value = 0;
    isPaused.value = false;
  };

  watch(isPaused, (val) => {
    if (val) pause();
    else resume();
  });

  // methods
  const start = () => {
    if (phase.value === 'focus') {
      startFocusPhase();
    } else if (phase.value === 'rest') {
      startRestPhase();
    }
  };

  const finishFocus = () => {
    if (phase.value === 'focus' && focusDuration.value > 0) {
      isPaused.value = true;
      startRestPhase();
    }
  };

  const pauseTimer = () => {
    isPaused.value = true;
  };

  const resumeTimer = () => {
    isPaused.value = false;
  };

  const reset = () => {
    isPaused.value = true;
    phase.value = 'focus';
    focusSeconds.value = 0;
    restSeconds.value = 0;
  };

  const skip = () => {
    if (phase.value === 'focus') {
      // Skip to rest if there's focus time
      if (focusDuration.value > 0) {
        finishFocus();
      }
    } else {
      // Skip rest and start new focus or stop
      handleRestComplete();
    }
  };

  onUnmounted(() => pause());

  return {
    // settings
    restRatio,
    isLooping,
    // states
    focusDuration,
    focusSeconds,
    phase,
    remainingRestSeconds,
    isPaused,
    isRunning,
    isFocusing,
    isResting,
    // time
    restDuration,
    progress,
    // methods
    start,
    pause: pauseTimer,
    resume: resumeTimer,
    reset,
    skip,
    finishFocus,
  };
};
