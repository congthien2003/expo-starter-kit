import React from "react";
import {
	TouchableOpacity,
	TouchableOpacityProps,
	Text,
	ActivityIndicator,
	View,
} from "react-native";

type ButtonVariant =
	| "primary"
	| "secondary"
	| "outline"
	| "ghost"
	| "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends TouchableOpacityProps {
	children: React.ReactNode;
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	disabled?: boolean;
	fullWidth?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}

const getVariantStyles = (variant: ButtonVariant, disabled: boolean) => {
	const baseStyles = {
		container: "",
		text: "",
	};

	if (disabled) {
		return {
			container: "bg-secondary-200",
			text: "text-secondary-400",
		};
	}

	switch (variant) {
		case "primary":
			return {
				container: "bg-primary-600 active:bg-primary-700",
				text: "text-white",
			};
		case "secondary":
			return {
				container: "bg-secondary-100 active:bg-secondary-200",
				text: "text-secondary-900",
			};
		case "outline":
			return {
				container:
					"border border-primary-600 bg-transparent active:bg-primary-50",
				text: "text-primary-600",
			};
		case "ghost":
			return {
				container: "bg-transparent active:bg-secondary-100",
				text: "text-secondary-700",
			};
		case "destructive":
			return {
				container: "bg-error-500 active:bg-error-600",
				text: "text-white",
			};
		default:
			return baseStyles;
	}
};

const getSizeStyles = (size: ButtonSize) => {
	switch (size) {
		case "sm":
			return {
				container: "px-3 py-2 rounded-md",
				text: "text-sm",
			};
		case "md":
			return {
				container: "px-4 py-3 rounded-lg",
				text: "text-base",
			};
		case "lg":
			return {
				container: "px-6 py-4 rounded-xl",
				text: "text-lg",
			};
		default:
			return {
				container: "px-4 py-3 rounded-lg",
				text: "text-base",
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
	...props
}) => {
	const variantStyles = getVariantStyles(variant, disabled || loading);
	const sizeStyles = getSizeStyles(size);

	return (
		<TouchableOpacity
			disabled={disabled || loading}
			className={`
        flex-row items-center justify-center
        ${variantStyles.container}
        ${sizeStyles.container}
        ${fullWidth ? "w-full" : ""}
      `}
			style={style}
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
					<Text
						className={`font-semibold ${variantStyles.text} ${sizeStyles.text}`}>
						{children}
					</Text>
					{rightIcon}
				</View>
			)}
		</TouchableOpacity>
	);
};

export default Button;
