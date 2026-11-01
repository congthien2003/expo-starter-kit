import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { normalizeError } from '@/lib/errors';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../schemas/forgotPasswordSchema';
import authService from '../services/authService';
import { AuthForm, AuthField } from './AuthForm';
import { useSubmitLock } from '../hooks/useSubmitLock';
export function ForgotPasswordScreen() {
  const [reset, setReset] = useState<{ email: string; ticket: string } | null>(null);
  const { control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: '' } });
  const submit = useSubmitLock(handleSubmit(async values => {
    try { const result = await authService.forgotPassword(values); if (result.isSuccess) setReset(result.data); else setError('root', { message: result.message }); }
    catch (error) { setError('root', { message: normalizeError(error).message }); }
  }));
  return <AuthForm title="Forgot password" description="Preview a password reset request.">
    {reset ? <><Typography>If an account exists, reset instructions would be sent. This demo sends no email; the demo link lasts 10 minutes.</Typography><Button onPress={() => router.push({ pathname: '/reset-password', params: reset })}>Continue with demo reset</Button></> : <>
      <AuthField control={control} name="email" label="Email address" keyboardType="email-address" autoComplete="email" />
      {errors.root?.message ? <Typography accessibilityRole="alert" color="danger">{errors.root.message}</Typography> : null}
      <Button loading={isSubmitting} onPress={() => { if (!isSubmitting) void submit(); }}>Request demo reset</Button>
    </>}
  </AuthForm>;
}
