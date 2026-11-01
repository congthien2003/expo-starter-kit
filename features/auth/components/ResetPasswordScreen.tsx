import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { normalizeError } from '@/lib/errors';
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas/resetPasswordSchema';
import authService from '../services/authService';
import { resetTicketService } from '../services/resetTicketService';
import { AuthForm, AuthField } from './AuthForm';
import { useSubmitLock } from '../hooks/useSubmitLock';
export function ResetPasswordScreen() {
  const { ticket } = useLocalSearchParams<{ ticket?: string }>();
  const [completedEmail, setCompletedEmail] = useState<string | null>(null);
  const { control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema), defaultValues: { password: '', confirmPassword: '' } });
  let validTicket = false;
  try { if (typeof ticket === 'string') { resetTicketService.inspect(ticket); validTicket = true; } } catch { /* Render an actionable expired link state. */ }
  const submit = useSubmitLock(handleSubmit(async values => {
    try { const result = await authService.resetPassword({ ticket: typeof ticket === 'string' ? ticket : '', password: values.password }); if (result.isSuccess) setCompletedEmail(result.data.email); else setError('root', { message: result.message }); }
    catch (error) { setError('root', { message: normalizeError(error).message }); }
  }));
  return <AuthForm title="Reset password" description="Choose a new password for this demo.">
    {completedEmail ? <><Typography>Demo reset complete. No real password was changed. Sign-in still accepts any valid email and non-empty password.</Typography><Button onPress={() => router.replace({ pathname: '/login', params: { email: completedEmail } })}>Return to sign in</Button></> : !validTicket ? <><Typography>This demo link is invalid or expired. Links also expire when the app restarts.</Typography><Button onPress={() => router.replace('/forgot-password')}>Request another reset</Button></> : <>
      <AuthField control={control} name="password" label="New password" isPassword autoComplete="new-password" />
      <AuthField control={control} name="confirmPassword" label="Confirm password" isPassword autoComplete="new-password" />
      {errors.root?.message ? <Typography accessibilityRole="alert" color="danger">{errors.root.message}</Typography> : null}
      <Button loading={isSubmitting} onPress={() => { if (!isSubmitting) void submit(); }}>Reset demo password</Button>
    </>}
  </AuthForm>;
}
