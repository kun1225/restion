<script lang="ts" setup>
import { useFormField } from './useFormField';

import type { LabelProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>();

const { error, formItemId } = useFormField();
</script>

<template>
  <Label
    data-slot="form-label"
    :data-error="!!error"
    :class="cn('data-[error=true]:text-destructive', props.class)"
    :for="formItemId"
  >
    <slot />
  </Label>
</template>
