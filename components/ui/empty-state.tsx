import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "./typography";
import { Button } from "./button";

interface EmptyStateProps {
	icon?: keyof typeof Ionicons.glyphMap;
	title: string;
	description?: string;
	actionLabel?: string;
	onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
	icon = "file-tray-outline",
	title,
	description,
	actionLabel,
	onAction,
}) => {
	return (
		<View className="flex-1 items-center justify-center py-12 px-6">
			<View className="w-20 h-20 rounded-full bg-secondary-100 items-center justify-center mb-4">
				<Ionicons name={icon} size={40} color="#64748b" />
			</View>
			<Typography variant="h4" align="center" className="mb-2">
				{title}
			</Typography>
			{description && (
				<Typography
					variant="body-sm"
					color="muted"
					align="center"
					className="mb-6">
					{description}
				</Typography>
			)}
			{actionLabel && onAction && (
				<Button variant="primary" onPress={onAction}>
					{actionLabel}
				</Button>
			)}
		</View>
	);
};

export default EmptyState;
