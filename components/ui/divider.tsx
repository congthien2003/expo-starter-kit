import React from "react";
import { View } from "react-native";

interface DividerProps {
	className?: string;
	vertical?: boolean;
}

export const Divider: React.FC<DividerProps> = ({
	className = "",
	vertical = false,
}) => {
	if (vertical) {
		return (
			<View className={`w-px bg-secondary-200 self-stretch ${className}`} />
		);
	}

	return <View className={`h-px bg-secondary-200 w-full ${className}`} />;
};

interface SpacerProps {
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	horizontal?: boolean;
}

const spacerSizes = {
	xs: "h-1 w-1",
	sm: "h-2 w-2",
	md: "h-4 w-4",
	lg: "h-6 w-6",
	xl: "h-8 w-8",
};

export const Spacer: React.FC<SpacerProps> = ({
	size = "md",
	horizontal = false,
}) => {
	const sizeClass = spacerSizes[size];
	return (
		<View
			className={horizontal ? sizeClass.split(" ")[1] : sizeClass.split(" ")[0]}
		/>
	);
};

export default Divider;
