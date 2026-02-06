import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Typography } from "./typography";

interface LoadingProps {
	size?: "small" | "large";
	color?: string;
	text?: string;
	fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
	size = "large",
	color = "#3b82f6",
	text,
	fullScreen = false,
}) => {
	if (fullScreen) {
		return (
			<View className="flex-1 items-center justify-center bg-white">
				<ActivityIndicator size={size} color={color} />
				{text && (
					<Typography variant="body-sm" color="muted" className="mt-3">
						{text}
					</Typography>
				)}
			</View>
		);
	}

	return (
		<View className="items-center justify-center py-8">
			<ActivityIndicator size={size} color={color} />
			{text && (
				<Typography variant="body-sm" color="muted" className="mt-3">
					{text}
				</Typography>
			)}
		</View>
	);
};

interface LoadingOverlayProps {
	visible: boolean;
	text?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
	visible,
	text,
}) => {
	if (!visible) return null;

	return (
		<View className="absolute inset-0 items-center justify-center bg-black/30 z-50">
			<View className="bg-white rounded-2xl p-6 items-center shadow-lg">
				<ActivityIndicator size="large" color="#3b82f6" />
				{text && (
					<Typography variant="body-sm" className="mt-3">
						{text}
					</Typography>
				)}
			</View>
		</View>
	);
};

export default Loading;
