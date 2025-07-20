<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type PasswordInputProps = {
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  class?: string;
};

type PasswordInputEmits = {
  (e: 'update:modelValue', value: string): void;
};

const props = withDefaults(defineProps<PasswordInputProps>(), {
  modelValue: '',
  placeholder: 'password',
  disabled: false,
  class: '',
});

const emit = defineEmits<PasswordInputEmits>();

const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const inputValue = computed({
  get: () => props.modelValue || '',
  set: (value: string) => emit('update:modelValue', value),
});
</script>

<template>
  <div class="relative">
    <Input
      v-model="inputValue"
      :type="showPassword ? 'text' : 'password'"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="cn('pr-10', props.class)"
    />
    <Button
      type="button"
      variant="ghost"
      size="sm"
      class="text-muted-foreground absolute right-1 top-1/2 -translate-y-1/2 hover:bg-transparent"
      :disabled="disabled"
      @click="togglePassword"
    >
      <Eye v-if="!showPassword" class="h-4 w-4" />
      <EyeOff v-else class="h-4 w-4" />
    </Button>
  </div>
</template>
