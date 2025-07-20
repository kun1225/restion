import { ERROR_CODES } from '@restion/shared';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { z } from 'zod';

import { useAuthStore } from '~~/stores/auth';

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

export function useRegisterForm() {
  const authStore = useAuthStore();
  const router = useRouter();

  const { handleSubmit, setErrors, isSubmitting, defineField } = useForm({
    validationSchema: registerSchema,
  });

  const mapApiErrorToFormError = (errorCode: string) => {
    switch (errorCode) {
      case ERROR_CODES.EMAIL_ALREADY_REGISTERED:
        return {
          email: '電子郵件已經被註冊',
        };
      default:
        return {};
    }
  };

  const onRegisterSubmit = handleSubmit(async (values) => {
    try {
      const response = await authStore.register(values);

      if (response?.success) {
        router.push('/');
        toast.success('註冊成功!');
      } else {
        const formErrors = mapApiErrorToFormError(response.error.code);
        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors);
        } else {
          toast.error(response.error.message || '註冊失敗，請稍後再試');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('註冊失敗，請稍後再試');
    }
  });

  return {
    handleSubmit,
    setErrors,
    isSubmitting,
    defineField,
    onRegisterSubmit,
  };
}
