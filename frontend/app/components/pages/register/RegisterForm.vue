<script setup lang="ts">
import { PasswordInput } from '@/components';
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
import { useRegisterForm } from '@/composables/useRegisterForm';

const { defineField, isSubmitting, onRegisterSubmit } = useRegisterForm();

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
                <PasswordInput
                  v-model="password"
                  v-bind="passwordProps"
                  placeholder="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="confirmPassword">
            <FormItem>
              <FormLabel>確認密碼</FormLabel>
              <FormControl>
                <PasswordInput
                  v-model="confirmPassword"
                  v-bind="confirmPasswordProps"
                  placeholder="password"
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
