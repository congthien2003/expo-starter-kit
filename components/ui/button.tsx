import * as Haptics from "expo-haptics";
import React from "react";
import {
	ActivityIndicator,
	Platform,
	Pressable,
	PressableProps,
	View,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { Typography } from "./typography";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant =
	| "primary"
	| "secondary"
	| "outline"
	| "ghost"
	| "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends PressableProps {
	children: React.ReactNode;
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	disabled?: boolean;
	fullWidth?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	className?: string;
}

const getVariantStyles = (variant: ButtonVariant, disabled: boolean) => {
	if (disabled) {
		return {
			container: "bg-neutral-200",
			textType: "muted" as const,
		};
	}

	switch (variant) {
		case "primary":
			return {
				container: "bg-primary-500 active:bg-primary-600",
				textType: "white" as const,
			};
		case "secondary":
			return {
				container: "bg-neutral-100 active:bg-neutral-200",
				textType: "default" as const,
			};
		case "outline":
			return {
				container:
					"border border-primary-500 bg-transparent active:bg-primary-50",
				textType: "primary" as const,
			};
		case "ghost":
			return {
				container: "bg-transparent active:bg-neutral-100",
				textType: "default" as const,
			};
		case "destructive":
			return {
				container: "bg-danger-500 active:bg-danger-600",
				textType: "white" as const,
			};
		default:
			return {
				container: "",
				textType: "default" as const,
			};
	}
};

const getSizeStyles = (size: ButtonSize) => {
	switch (size) {
		case "sm":
			return {
				container: "px-3 py-2 rounded-md",
				textVariant: "body-sm" as const,
			};
		case "md":
			return {
				container: "px-4 py-3 rounded-md",
				textVariant: "body" as const,
			};
		case "lg":
			return {
				container: "px-6 py-4 rounded-xl",
				textVariant: "h4" as const,
			};
		default:
			return {
				container: "px-4 py-3 rounded-md",
				textVariant: "body" as const,
			};
	}
};

export const Button: React.FC<ButtonProps> = ({
	children,
	variant = "primary",
	size = "md",
	loading = false,
	disabled = false,
	fullWidth = false,
	leftIcon,
	rightIcon,
	style,
	onPressIn,
	onPressOut,
	className,
	...props
}) => {
	const variantStyles = getVariantStyles(variant, disabled || loading);
	const sizeStyles = getSizeStyles(size);

	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	const handlePressIn = (e: any) => {
		scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
		if (Platform.OS !== "web" && !disabled && !loading) {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		}
		if (onPressIn) onPressIn(e);
	};

	const handlePressOut = (e: any) => {
		scale.value = withSpring(1, { damping: 15, stiffness: 300 });
		if (onPressOut) onPressOut(e);
	};

	return (
		<AnimatedPressable
			disabled={disabled || loading}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			className={`
        flex-row items-center justify-center
        ${variantStyles.container}
        ${sizeStyles.container}
        ${fullWidth ? "w-full" : ""}
      ${className}`}
			style={[style, animatedStyle]}
			{...props}>
			{loading ? (
				<ActivityIndicator
					size="small"
					color={
						variant === "primary" || variant === "destructive"
							? "#fff"
							: "#3b82f6"
					}
				/>
			) : (
				<View className="flex-row items-center gap-2">
					{leftIcon}
					<Typography
						variant={sizeStyles.textVariant}
						color={variantStyles.textType}
						weight="semibold">
						{children}
					</Typography>
					{rightIcon}
				</View>
			)}
		</AnimatedPressable>
	);
};

export default Button;
