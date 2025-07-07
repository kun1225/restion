<script setup lang="ts">
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

import { useAuthStore } from '~~/stores/auth';
import { useRouter } from 'vue-router';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const authStore = useAuthStore();
const router = useRouter();

const loginSchema = toTypedSchema(
  z.object({
    email: z
      .string({ required_error: '請輸入電子郵件' })
      .email('請輸入正確的電子郵件'),
    password: z
      .string({ required_error: '請輸入密碼' })
      .min(8, '密碼至少需要8個字元'),
  }),
);

const { handleSubmit, setErrors, isSubmitting, defineField } = useForm({
  validationSchema: loginSchema,
});

const [email, emailProps] = defineField('email', {
  validateOnBlur: false,
  validateOnChange: false,
  validateOnModelUpdate: false,
});

const [password, passwordProps] = defineField('password', {
  validateOnBlur: false,
  validateOnChange: false,
  validateOnModelUpdate: false,
});

const onLoginSubmit = handleSubmit(async (values) => {
  try {
    await authStore.login(values);
    router.push('/');
  } catch (error: any) {
    setErrors({ email: error.data?.message || '登入失敗' });
  }
});
</script>

<template>
  <div class="flex h-full items-center justify-center">
    <Card class="w-lg">
      <CardHeader>
        <CardTitle class="text-2xl font-bold">Welcome to Restion!</CardTitle>
        <CardDescription class="text-sm">請輸入你的帳號密碼</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit="onLoginSubmit" class="space-y-6">
          <FormField name="email">
            <FormItem>
              <FormLabel>電子郵件</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@mail.com"
                  v-bind="emailProps"
                  v-model="email"
                  autocomplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="password">
            <FormItem>
              <FormLabel>密碼</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="password"
                  v-model="password"
                  v-bind="passwordProps"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button
            type="submit"
            class="w-full"
            size="lg"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? '登入中...' : '登入' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
