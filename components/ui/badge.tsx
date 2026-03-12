import React from "react";
import { View } from "react-native";
import { Typography } from "./typography";

type BadgeVariant =
	| "default"
	| "primary"
	| "success"
	| "warning"
	| "danger"
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
				container: "bg-neutral-100",
				textVariantType: "default" as const,
			};
		case "primary":
			return {
				container: "bg-primary-100",
				textVariantType: "primary" as const,
			};
		case "success":
			return {
				container: "bg-success-100",
				textVariantType: "success" as const,
			};
		case "warning":
			return {
				container: "bg-warning-100",
				textVariantType: "warning" as const,
			};
		case "danger":
			return {
				container: "bg-danger-100",
				textVariantType: "danger" as const,
			};
		case "outline":
			return {
				container: "bg-transparent border border-neutral-200",
				textVariantType: "default" as const,
			};
		default:
			return {
				container: "bg-neutral-100",
				textVariantType: "default" as const,
			};
	}
};

const getSizeStyles = (size: BadgeSize) => {
	switch (size) {
		case "sm":
			return {
				container: "px-2 py-0.5 rounded-sm",
				textVariantDef: "caption" as const,
			};
		case "md":
			return {
				container: "px-2.5 py-1 rounded-md",
				textVariantDef: "body-sm" as const,
			};
		default:
			return {
				container: "px-2.5 py-1 rounded-md",
				textVariantDef: "body-sm" as const,
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
			<Typography 
				variant={sizeStyles.textVariantDef} 
				color={variantStyles.textVariantType} 
				weight="medium"
			>
				{children}
			</Typography>
		</View>
	);
};

export default Badge;
