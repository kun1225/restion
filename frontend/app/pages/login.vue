<script setup lang="ts">
import { ref } from 'vue';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '~~/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

// --- Form Schemas ---
const loginSchema = toTypedSchema(
  z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
);

const registerSchema = toTypedSchema(
  z
    .object({
      email: z.string().email('Invalid email'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),
);

// --- Form Handling ---
const loginForm = useForm({
  validationSchema: loginSchema,
});

const registerForm = useForm({
  validationSchema: registerSchema,
});

const onLoginSubmit = loginForm.handleSubmit(async (values) => {
  try {
    await authStore.login(values);
    router.push('/');
  } catch (error: any) {
    loginForm.setErrors({ email: error.data?.message || 'Login failed' });
  }
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
  <div class="bg-background flex min-h-screen items-center justify-center">
    <Tabs default-value="login" class="w-[400px]">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="login"> Login </TabsTrigger>
        <TabsTrigger value="register"> Register </TabsTrigger>
      </TabsList>

      <!-- Login Form -->
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription
              >Enter your credentials to access your account.</CardDescription
            >
          </CardHeader>
          <CardContent>
            <form @submit="onLoginSubmit" class="space-y-4">
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
              <Button
                type="submit"
                class="w-full"
                :disabled="loginForm.isSubmitting.value"
              >
                {{ loginForm.isSubmitting.value ? 'Logging in...' : 'Login' }}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Register Form -->
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create a new account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit="onRegisterSubmit" class="space-y-4">
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
                {{
                  registerForm.isSubmitting.value
                    ? 'Registering...'
                    : 'Register'
                }}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
