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
    email: z.string().email('請輸入正確的電子郵件'),
    password: z.string().min(8, '密碼至少需要8個字元'),
  }),
);

const loginForm = useForm({
  validationSchema: loginSchema,
});

const onLoginSubmit = loginForm.handleSubmit(async (values) => {
  try {
    await authStore.login(values);
    router.push('/');
  } catch (error: any) {
    loginForm.setErrors({ email: error.data?.message || '登入失敗' });
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
        <form @submit="onLoginSubmit" class="space-y-8">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>電子郵件</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@mail.com"
                  v-bind="componentField"
                  autocomplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>密碼</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="password"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button
            type="submit"
            class="w-full"
            size="lg"
            :disabled="loginForm.isSubmitting.value"
          >
            {{ loginForm.isSubmitting.value ? '登入中...' : '登入' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
