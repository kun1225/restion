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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '~~/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const registerSchema = toTypedSchema(
  z
    .object({
      email: z.string().email('Invalid email'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords don\'t match',
      path: ['confirmPassword'],
    }),
);

const registerForm = useForm({
  validationSchema: registerSchema,
});

const onRegisterSubmit = registerForm.handleSubmit(async (values) => {
  try {
    await authStore.register(values);
    router.push('/');
  } catch (error: any) {
    registerForm.setErrors({
      email: error.data?.message || 'Registration failed',
    });
  }
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Register</CardTitle>
      <CardDescription>Create a new account.</CardDescription>
    </CardHeader>
    <CardContent>
      <form class="space-y-4" @submit="onRegisterSubmit">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="m@example.com"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="confirmPassword">
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button
          type="submit"
          class="w-full"
          :disabled="registerForm.isSubmitting.value"
        >
          {{ registerForm.isSubmitting.value ? 'Registering...' : 'Register' }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>
