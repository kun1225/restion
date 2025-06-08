import { ref, computed, watch, onUnmounted } from 'vue';
import { useIntervalFn } from '@vueuse/core';

export type TimerPhase = 'focus' | 'rest';

export const useTimer = () => {
  // settings
  const restRatio = ref(5); // default 5:1
  const isLooping = ref(true);

  // states
  const focusDuration = ref(0); // seconds
  const phase = ref<TimerPhase>('focus');
  const isPaused = ref(true);
  const isRunning = computed(() => !isPaused.value);
  const isFocusing = computed(() => phase.value === 'focus');
  const isResting = computed(() => phase.value === 'rest');

  // time calculation
  const restDuration = computed(() => Math.round(focusDuration.value / restRatio.value));
  const remainingRestDuration = ref(restDuration.value);

  // progress percentage
  const progress = computed(() => {
    if (phase.value === 'focus') {
      return 0;
    } else {
      return 1 - remainingRestDuration.value / restDuration.value;
    }
  });

  // countdown timer
  const { pause, resume } = useIntervalFn(
    () => {
      if (phase.value === 'focus') {
        focusDuration.value = focusDuration.value + 1;
      } else if (phase.value === 'rest') {
        remainingRestDuration.value = remainingRestDuration.value - 1;
      }
    },
    1000,
    { immediate: false },
  );

  watch(isPaused, (val) => {
    if (val) pause();
    else resume();
  });

  // reset when restRatio changes
  watch([restRatio, phase], () => {
    reset();
  });

  // methods
  const start = () => {
    if (phase.value === 'focus') {
      focusDuration.value = 0;
    } else if (phase.value === 'rest') {
      remainingRestDuration.value = restDuration.value;
    }
    isPaused.value = false;
  };

  const pauseTimer = () => {
    isPaused.value = true;
  };

  const reset = () => {
    isPaused.value = true;
    phase.value = 'focus';
    remainingRestDuration.value = restDuration.value;
  };

  const skip = () => {
    reset();
  };

  onUnmounted(() => pause());

  return {
    // settings
    restRatio,
    isLooping,
    // states
    focusDuration,
    phase,
    remainingRestDuration,
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
    resume,
    reset,
    skip,
  };
};
