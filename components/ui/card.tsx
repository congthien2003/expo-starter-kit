import React from "react";
import {
	View,
	ViewProps,
	TouchableOpacity,
	TouchableOpacityProps,
} from "react-native";

interface CardProps extends ViewProps {
	children: React.ReactNode;
	variant?: "elevated" | "outlined" | "filled";
	padding?: "none" | "sm" | "md" | "lg";
}

interface PressableCardProps extends TouchableOpacityProps {
	children: React.ReactNode;
	variant?: "elevated" | "outlined" | "filled";
	padding?: "none" | "sm" | "md" | "lg";
}

const getVariantStyles = (variant: CardProps["variant"]) => {
	switch (variant) {
		case "elevated":
			return "bg-white shadow-md shadow-black/10";
		case "outlined":
			return "bg-white border border-secondary-200";
		case "filled":
			return "bg-secondary-50";
		default:
			return "bg-white shadow-sm shadow-black/5";
	}
};

const getPaddingStyles = (padding: CardProps["padding"]) => {
	switch (padding) {
		case "none":
			return "";
		case "sm":
			return "p-2";
		case "md":
			return "p-4";
		case "lg":
			return "p-6";
		default:
			return "p-4";
	}
};

export const Card: React.FC<CardProps> = ({
	children,
	variant = "elevated",
	padding = "md",
	className,
	...props
}) => {
	const variantStyles = getVariantStyles(variant);
	const paddingStyles = getPaddingStyles(padding);

	return (
		<View
			className={`rounded-xl ${variantStyles} ${paddingStyles} ${className || ""}`}
			{...props}>
			{children}
		</View>
	);
};

export const PressableCard: React.FC<PressableCardProps> = ({
	children,
	variant = "elevated",
	padding = "md",
	className,
	...props
}) => {
	const variantStyles = getVariantStyles(variant);
	const paddingStyles = getPaddingStyles(padding);

	return (
		<TouchableOpacity
			className={`rounded-xl ${variantStyles} ${paddingStyles} active:opacity-80 ${className || ""}`}
			{...props}>
			{children}
		</TouchableOpacity>
	);
};

export default Card;
