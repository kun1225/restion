<script setup lang="ts">
import type { TimerPhase } from '~/composables/useTimer';

import { Button } from '~/components/ui/button';
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
  <div class="mt-6 flex flex-wrap items-center justify-center gap-4">
    <!-- Start button - only show when not running -->
    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          size="lg"
          :variant="props.isPaused ? 'default' : 'outline'"
          :aria-label="props.isPaused ? '開始計時' : '暫停計時'"
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
        {{ props.isPaused ? '開始計時' : '暫停計時' }}
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          :aria-label="props.phase === 'focus' ? '開始休息' : '開始專注'"
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
        {{ props.phase === 'focus' ? '開始休息' : '開始專注' }}
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
        {{ props.isLooping ? '關閉循環' : '啟動循環' }}
      </TooltipContent>
    </Tooltip>
  </div>
</template>
