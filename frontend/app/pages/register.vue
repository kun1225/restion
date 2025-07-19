<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '~~/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const registerSchema = toTypedSchema(
  z
    .object({
      email: z
        .string({ required_error: '請輸入電子郵件' })
        .email('請輸入正確的電子郵件'),
      password: z
        .string({ required_error: '請輸入密碼' })
        .min(6, '密碼至少需要 6 個字元'),
      confirmPassword: z.string({ required_error: '請輸入確認密碼' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: '密碼不同',
      path: ['confirmPassword'],
    }),
);

const { handleSubmit, setErrors, isSubmitting, defineField } = useForm({
  validationSchema: registerSchema,
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

const [confirmPassword, confirmPasswordProps] = defineField('confirmPassword', {
  validateOnBlur: false,
  validateOnChange: false,
  validateOnModelUpdate: false,
});

const onRegisterSubmit = handleSubmit(async (values) => {
  try {
    await authStore.register(values);
    router.push('/');
  } catch (error: unknown) {
    setErrors({
      email: error instanceof Error ? error.message : 'Registration failed',
    });
  }
});
</script>

<template>
  <div class="flex h-full items-center justify-center">
    <Card class="w-lg">
      <CardHeader>
        <CardTitle class="text-2xl font-bold">註冊 Restion!</CardTitle>
        <CardDescription class="text-sm">請輸入你的帳號密碼</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-6" @submit="onRegisterSubmit">
          <FormField name="email">
            <FormItem>
              <FormLabel>電子郵件</FormLabel>
              <FormControl>
                <Input
                  v-bind="emailProps"
                  v-model="email"
                  type="email"
                  placeholder="example@mail.com"
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
                  v-model="password"
                  type="password"
                  placeholder="password"
                  v-bind="passwordProps"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="confirmPassword">
            <FormItem>
              <FormLabel>確認密碼</FormLabel>
              <FormControl>
                <Input
                  v-model="confirmPassword"
                  type="password"
                  placeholder="password"
                  v-bind="confirmPasswordProps"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="submit" class="w-full" :disabled="isSubmitting">
            {{ isSubmitting ? '註冊中...' : '註冊' }}
          </Button>

          <Separator class="my-6">Or</Separator>

          <div class="flex items-center justify-center">
            <p class="text-muted-foreground text-sm">
              已經有帳號嗎？
              <Button variant="link" size="link" as-child>
                <NuxtLink to="/login" class="text-primary">登入</NuxtLink>
              </Button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
