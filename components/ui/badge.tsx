import React from "react";
import { View, Text } from "react-native";

type BadgeVariant =
	| "default"
	| "primary"
	| "success"
	| "warning"
	| "error"
	| "outline";
type BadgeSize = "sm" | "md";

interface BadgeProps {
	children: React.ReactNode;
	variant?: BadgeVariant;
	size?: BadgeSize;
}

const getVariantStyles = (variant: BadgeVariant) => {
	switch (variant) {
		case "default":
			return {
				container: "bg-secondary-100",
				text: "text-secondary-700",
			};
		case "primary":
			return {
				container: "bg-primary-100",
				text: "text-primary-700",
			};
		case "success":
			return {
				container: "bg-success-50",
				text: "text-success-600",
			};
		case "warning":
			return {
				container: "bg-warning-50",
				text: "text-warning-600",
			};
		case "error":
			return {
				container: "bg-error-50",
				text: "text-error-600",
			};
		case "outline":
			return {
				container: "bg-transparent border border-secondary-300",
				text: "text-secondary-700",
			};
		default:
			return {
				container: "bg-secondary-100",
				text: "text-secondary-700",
			};
	}
};

const getSizeStyles = (size: BadgeSize) => {
	switch (size) {
		case "sm":
			return {
				container: "px-2 py-0.5 rounded",
				text: "text-xs",
			};
		case "md":
			return {
				container: "px-2.5 py-1 rounded-md",
				text: "text-sm",
			};
		default:
			return {
				container: "px-2.5 py-1 rounded-md",
				text: "text-sm",
			};
	}
};

export const Badge: React.FC<BadgeProps> = ({
	children,
	variant = "default",
	size = "md",
}) => {
	const variantStyles = getVariantStyles(variant);
	const sizeStyles = getSizeStyles(size);

	return (
		<View
			className={`self-start ${variantStyles.container} ${sizeStyles.container}`}>
			<Text className={`font-medium ${variantStyles.text} ${sizeStyles.text}`}>
				{children}
			</Text>
		</View>
	);
};

export default Badge;
