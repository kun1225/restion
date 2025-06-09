<script setup lang="ts">
import { Button } from '~/components/ui/button';
import type { TimerPhase } from '~/composables/useTimer';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip';

const props = defineProps<{
  isPaused: boolean;
  isLooping: boolean;
  phase: TimerPhase;
  onStart: () => void;
  onPause: () => void;
  onSkip: () => void;
  onToggleLoop: () => void;
}>();
</script>

<template>
  <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
    <!-- Start button - only show when not running -->
    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          size="lg"
          :variant="props.isPaused ? 'default' : 'outline'"
          :aria-label="props.isPaused ? 'Start Timer' : 'Pause Timer'"
          @click="
            () => {
              if (props.isPaused) {
                props.onStart();
              } else {
                props.onPause();
              }
            }
          "
        >
          <Icon
            :name="props.isPaused ? 'lucide:play' : 'lucide:stretch-vertical'"
            :mode="'svg'"
          />
        </Button>
      </TooltipTrigger>

      <TooltipContent side="bottom">
        {{ props.isPaused ? 'Start Timer' : 'Pause Timer' }}
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          :aria-label="
            props.phase === 'focus' ? 'Skip to Rest' : 'Skip to Focus'
          "
          size="lg"
          @click="props.onSkip"
        >
          <Icon
            :name="
              props.phase === 'focus'
                ? 'lucide:circle-stop'
                : 'lucide:skip-forward'
            "
            :mode="'svg'"
          />
        </Button>
      </TooltipTrigger>

      <TooltipContent side="bottom">
        {{ props.phase === 'focus' ? 'Skip to Rest' : 'Skip to Focus' }}
      </TooltipContent>
    </Tooltip>

    <!-- Loop toggle button -->
    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          size="lg"
          :variant="props.isLooping ? 'default' : 'outline'"
          aria-label="Toggle Loop"
          @click="props.onToggleLoop"
        >
          <Icon
            :name="
              props.isLooping ? 'lucide:refresh-cw' : 'lucide:refresh-cw-off'
            "
            :mode="'svg'"
          />
        </Button>
      </TooltipTrigger>

      <TooltipContent side="bottom">
        {{ props.isLooping ? 'Set Loop Off' : 'Set Loop On' }}
      </TooltipContent>
    </Tooltip>
  </div>
</template>
