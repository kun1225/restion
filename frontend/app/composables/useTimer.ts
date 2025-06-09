import { ref, computed, watch, onUnmounted } from 'vue';
import { useIntervalFn } from '@vueuse/core';

export type TimerPhase = 'focus' | 'rest';

export const useTimer = () => {
  // Settings
  const restRatio = ref(5); // default 5:1
  const isLooping = ref(true);

  // States
  const focusSeconds = ref(0); // focus time in seconds
  const restSeconds = ref(0); // rest time in seconds
  const currentStageRestSeconds = ref(0);
  const phase = ref<TimerPhase>('focus');
  const isPaused = ref(true);

  const isFocusing = computed(() => phase.value === 'focus');
  const isResting = computed(() => phase.value === 'rest');

  // Progress percentage (only shown during rest phase)
  const progress = computed(() => {
    if (phase.value === 'focus') {
      return 1; // no progress shown during focus phase
    } else {
      if (currentStageRestSeconds.value === 0) return 1;

      return (
        (currentStageRestSeconds.value - restSeconds.value) /
        currentStageRestSeconds.value
      );
    }
  });

  // Timer
  const { pause, resume } = useIntervalFn(
    () => {
      if (isPaused.value) return;

      if (phase.value === 'focus') {
        focusSeconds.value += 1;
      } else if (phase.value === 'rest') {
        restSeconds.value -= 1;

        // Rest time ended
        if (restSeconds.value <= 0) {
          phase.value = 'focus';
          focusSeconds.value = 0;

          if (isLooping.value) {
            start();
          } else {
            pause();
          }
        }
      }
    },
    1000,
    { immediate: false },
  );

  // Watch pause state
  watch(isPaused, (val) => {
    if (val) pause();
    else resume();
  });

  const start = () => {
    isPaused.value = false;
  };

  const pauseTimer = () => {
    isPaused.value = true;
  };

  const skip = () => {
    if (phase.value === 'focus') {
      // Skip from focus to rest
      phase.value = 'rest';
      restSeconds.value = Math.floor(focusSeconds.value / restRatio.value);
      currentStageRestSeconds.value = restSeconds.value;
    } else {
      // Skip from rest to focus (or end)
      phase.value = 'focus';
      focusSeconds.value = 0;
      restSeconds.value = 0;
      currentStageRestSeconds.value = 0;
    }

    if (isLooping.value) {
      start();
    } else {
      pause();
    }
  };

  // Cleanup
  onUnmounted(() => pause());

  return {
    // Settings
    restRatio,
    isLooping,
    // States
    focusSeconds,
    restSeconds,
    phase,
    isPaused,
    isFocusing,
    isResting,
    progress,
    // Methods
    start,
    pause: pauseTimer,
    skip,
  };
};
