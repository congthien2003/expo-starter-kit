import { Button } from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Input } from "@/components/ui/input"; // Assuming this exists based on your UI folder
import { ScreenWrapper } from "@/components/ui/screen-wrapper";
import { Typography } from "@/components/ui/typography";
import { router } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";

export default function DemoLoginScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = () => {
		setIsLoading(true);
		// Mock login delay
		setTimeout(() => {
			setIsLoading(false);
			router.push("/demo-home");
		}, 1000);
	};

	return (
		<ScreenWrapper
			scrollable={true}
			withBottomInsets={true}
			withTopInsets={true}>
			<View className="px-6 pt-12 pb-6 flex-1">
				{/* Back Button */}
				<Button
					variant="ghost"
					size="sm"
					className="w-12 h-12 rounded-full p-0 items-center justify-center -ml-3 mb-6"
					onPress={() => router.back()}>
					<IconSymbol name="chevron.left" size={24} color="#11181C" />
				</Button>

				{/* Header Section */}
				<View className="mb-10 items-center">
					<View className="w-24 h-24 bg-primary-100 rounded-3xl items-center justify-center mb-6">
						<IconSymbol
							name="person.circle.fill"
							size={48}
							color="#0a7ea4"
						/>
					</View>
					<Typography variant="h1" className="mb-2">
						Welcome Back
					</Typography>
					<Typography variant="body" color="muted" align="center">
						Màn hình này test KeyboardAvoidingView và cuộn khi có
						nhiều text input
					</Typography>
				</View>

				{/* Form Section */}
				<View className="gap-5">
					<Input
						label="Email Address"
						placeholder="hello@example.com"
						keyboardType="email-address"
						autoCapitalize="none"
						value={email}
						onChangeText={setEmail}
					/>

					<Input
						label="Password"
						placeholder="••••••••"
						secureTextEntry
						value={password}
						onChangeText={setPassword}
					/>

					{/* Thêm nhiều input để test scroll behavior khi mở bàn phím */}
					<Input
						label="Mã giới thiệu (Opsional)"
						placeholder="Nhập mã giới thiệu"
					/>

					<Input
						label="Số điện thoại"
						placeholder="0912 345 678"
						keyboardType="phone-pad"
					/>

					<View className="items-end mt-2">
						<Typography
							variant="body-sm"
							color="primary"
							weight="semibold">
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

				{/* Footer */}
				<View className="mt-12 flex-row justify-center gap-1">
					<Typography variant="body" color="muted">
						Don't have an account?
					</Typography>
					<Typography
						variant="body"
						color="primary"
						weight="semibold">
						Sign up
					</Typography>
				</View>
			</View>
		</ScreenWrapper>
	);
}
