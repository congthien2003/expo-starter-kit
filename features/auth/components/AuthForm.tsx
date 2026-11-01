import React from 'react';
import { View, type TextInputProps } from 'react-native';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { ScreenWrapper } from '@/components/ui/screen-wrapper';
import { Typography } from '@/components/ui/typography';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';
export function AuthForm({ title, description, children, back = true }: React.PropsWithChildren<{ title: string; description: string; back?: boolean }>) {
  return <ScreenWrapper scrollable><View className="px-6 py-8 gap-5">
    {back ? <Button variant="ghost" onPress={() => router.canGoBack() ? router.back() : router.replace('/login')}>Back to sign in</Button> : null}
    <Typography variant="h1">{title}</Typography>
    <Typography color="muted">{description}</Typography>
    <View className="bg-primary-50 p-3 rounded-md"><Typography variant="caption">Demo mode — no server authentication, account creation, or real password changes.</Typography></View>
    {children}
  </View></ScreenWrapper>;
}
export function AuthField<T extends FieldValues>({ control, name, label, isPassword = false, ...props }: { control: Control<T>; name: Path<T>; label: string; isPassword?: boolean } & Pick<TextInputProps, 'keyboardType' | 'autoComplete' | 'textContentType' | 'returnKeyType' | 'onSubmitEditing'>) {
  return <Controller control={control} name={name} render={({ field, fieldState }) => <Input {...props} ref={field.ref} label={label} value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} autoCapitalize="none" autoCorrect={false} isPassword={isPassword} error={fieldState.error?.message} />} />;
}
