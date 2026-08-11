import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScreenWrapper } from "@/components/ui/screen-wrapper";
import { Typography } from "@/components/ui/typography";
import { useAuth } from "../hooks/useAuth";
import { LoginFormValues, loginSchema } from "../schemas/loginSchema";

export function LoginScreen() {
	const { login, isLoading } = useAuth();
	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	const handleLogin = handleSubmit(async ({ email, password }) => {
		if (await login(email, password)) {
			router.push("/demo-home");
			return;
		}

		setError("root", { message: "Unable to sign in. Please try again." });
	});

	return (
		<ScreenWrapper scrollable withBottomInsets withTopInsets>
			<View className="px-6 pt-12 pb-6 flex-1">
				<Button
					variant="ghost"
					size="sm"
					className="w-12 h-12 rounded-full p-0 items-center justify-center -ml-3 mb-6"
					onPress={() => router.back()}>
					<Ionicons name="chevron-back" size={24} color="#11181C" />
				</Button>

				<View className="mb-10 items-center">
					<View className="w-24 h-24 bg-primary-100 rounded-3xl items-center justify-center mb-6">
						<Ionicons name="person-circle" size={48} color="#0a7ea4" />
					</View>
					<Typography variant="h1" className="mb-2">
						Welcome Back
					</Typography>
					<Typography variant="body" color="muted" align="center">
						Màn hình này test KeyboardAvoidingView và cuộn khi có nhiều text
						input
					</Typography>
				</View>

				<View className="gap-5">
					<Controller
						control={control}
						name="email"
						render={({ field: { onBlur, onChange, value } }) => (
							<Input
								label="Email Address"
								placeholder="hello@example.com"
								keyboardType="email-address"
								autoCapitalize="none"
								autoCorrect={false}
								value={value}
								onBlur={onBlur}
								onChangeText={onChange}
								error={errors.email?.message}
							/>
						)}
					/>

					<Controller
						control={control}
						name="password"
						render={({ field: { onBlur, onChange, value } }) => (
							<Input
								label="Password"
								placeholder="••••••••"
								isPassword
								value={value}
								onBlur={onBlur}
								onChangeText={onChange}
								error={errors.password?.message}
							/>
						)}
					/>

					<Input
						label="Mã giới thiệu (Opsional)"
						placeholder="Nhập mã giới thiệu"
					/>

					<Input
						label="Số điện thoại"
						placeholder="0912 345 678"
						keyboardType="phone-pad"
					/>

					{errors.root?.message && (
						<Typography variant="caption" color="danger">
							{errors.root.message}
						</Typography>
					)}

					<View className="items-end mt-2">
						<Typography variant="body-sm" color="primary" weight="semibold">
							Forgot Password?
						</Typography>
					</View>

					<Button
						variant="primary"
						size="lg"
						loading={isLoading}
						onPress={handleLogin}>
						Sign In
					</Button>
				</View>

				<View className="mt-12 flex-row justify-center gap-1">
					<Typography variant="body" color="muted">
						Don&apos;t have an account?
					</Typography>
					<Typography variant="body" color="primary" weight="semibold">
						Sign up
					</Typography>
				</View>
			</View>
		</ScreenWrapper>
	);
}
