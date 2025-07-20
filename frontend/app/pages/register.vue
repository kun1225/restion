<script setup lang="ts">
import { ERROR_CODES } from '@restion/shared';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
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
        .min(8, '密碼至少需要 8 個字元')
        .max(64, '密碼最多只能 64 個字元'),
      confirmPassword: z
        .string({ required_error: '請輸入確認密碼' })
        .min(8, '確認密碼至少需要 8 個字元')
        .max(64, '確認密碼最多只能 64 個字元'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: '輸入的密碼不同',
      path: ['confirmPassword'],
    }),
);

const { handleSubmit, setErrors, isSubmitting, defineField } = useForm({
  validationSchema: registerSchema,
});

const fieldConfig = {
  validateOnBlur: false,
  validateOnChange: false,
  validateOnModelUpdate: false,
};

const [email, emailProps] = defineField('email', {
  ...fieldConfig,
});

const [password, passwordProps] = defineField('password', {
  ...fieldConfig,
});

const [confirmPassword, confirmPasswordProps] = defineField('confirmPassword', {
  ...fieldConfig,
});

const onRegisterSubmit = handleSubmit(async (values) => {
  try {
    const response = await authStore.register(values);

    if (response?.success) {
      router.push('/');
      toast.success('註冊成功!');
    } else {
      switch (response.error.code) {
        case ERROR_CODES.EMAIL_ALREADY_REGISTERED:
          setErrors({
            email: '電子郵件已經被註冊',
          });
          break;
      }
    }
  } catch (err) {
    console.error(err);
    toast.error('註冊失敗，請稍後再試');
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
