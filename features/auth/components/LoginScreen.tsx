import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, type LoginFormValues } from '../schemas/loginSchema';
import { AuthField, AuthForm } from './AuthForm';
import { MockScenarioPicker } from './MockScenarioPicker';
import { useSubmitLock } from '../hooks/useSubmitLock';
export function LoginScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { login } = useAuth();
  const { control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: typeof email === 'string' ? email : '', password: '' } });
  const submit = useSubmitLock(handleSubmit(async values => {
    const result = await login(values.email, values.password);
    if (!result.isSuccess) setError('root', { message: result.message });
    // Protected routes select home after session publication; no second navigation race.
  }));
  return <AuthForm title="Welcome back" description="Sign in to explore the mobile starter kit." back={false}>
    <AuthField control={control} name="email" label="Email address" keyboardType="email-address" autoComplete="email" />
    <AuthField control={control} name="password" label="Password" isPassword autoComplete="current-password" onSubmitEditing={() => { if (!isSubmitting) void submit(); }} />
    {errors.root?.message ? <Typography accessibilityRole="alert" color="danger">{errors.root.message}</Typography> : null}
    <Button loading={isSubmitting} onPress={() => { if (!isSubmitting) void submit(); }}>Sign in</Button>
    <Button variant="ghost" disabled={isSubmitting} onPress={() => router.push('/forgot-password')}>Forgot password?</Button>
    <Button variant="outline" disabled={isSubmitting} onPress={() => router.push('/register')}>Create an account</Button>
    <MockScenarioPicker />
  </AuthForm>;
}
