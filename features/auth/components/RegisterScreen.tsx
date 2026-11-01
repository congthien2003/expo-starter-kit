import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { normalizeError } from '@/lib/errors';
import { registerSchema, type RegisterFormValues } from '../schemas/registerSchema';
import authService from '../services/authService';
import { AuthForm, AuthField } from './AuthForm';
import { useSubmitLock } from '../hooks/useSubmitLock';
export function RegisterScreen() {
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const { control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema), defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' } });
  const submit = useSubmitLock(handleSubmit(async values => {
    try { const result = await authService.register(values); if (result.isSuccess) setRegisteredEmail(result.data.email); else setError('root', { message: result.message }); }
    catch (error) { setError('root', { message: normalizeError(error).message }); }
  }));
  return <AuthForm title="Create account" description="Preview the registration flow.">
    {registeredEmail ? <><Typography>Demo registration complete. No account or password was saved.</Typography><Button onPress={() => router.replace({ pathname: '/login', params: { email: registeredEmail } })}>Continue to sign in</Button></> : <>
      <AuthField control={control} name="fullName" label="Full name" autoComplete="name" />
      <AuthField control={control} name="email" label="Email address" keyboardType="email-address" autoComplete="email" />
      <AuthField control={control} name="password" label="Password" isPassword autoComplete="new-password" />
      <AuthField control={control} name="confirmPassword" label="Confirm password" isPassword autoComplete="new-password" />
      {errors.root?.message ? <Typography accessibilityRole="alert" color="danger">{errors.root.message}</Typography> : null}
      <Button loading={isSubmitting} onPress={() => { if (!isSubmitting) void submit(); }}>Create demo account</Button>
    </>}
  </AuthForm>;
}
