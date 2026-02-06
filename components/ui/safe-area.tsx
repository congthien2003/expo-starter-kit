import React from "react";
import { View, ViewProps } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeAreaProps extends ViewProps {
	children: React.ReactNode;
	edges?: ("top" | "bottom" | "left" | "right")[];
	backgroundColor?: string;
}

export const SafeArea: React.FC<SafeAreaProps> = ({
	children,
	edges = ["top", "bottom"],
	backgroundColor = "white",
	className,
	...props
}) => {
	return (
		<SafeAreaView
			className={`flex-1 bg-${backgroundColor} ${className || ""}`}
			{...props}>
			{children}
		</SafeAreaView>
	);
};

interface ScreenContainerProps extends ViewProps {
	children: React.ReactNode;
	withPadding?: boolean;
	withSafeArea?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
	children,
	withPadding = true,
	withSafeArea = true,
	className,
	...props
}) => {
	const insets = useSafeAreaInsets();

	return (
		<View
			className={`flex-1 bg-white ${className || ""}`}
			style={
				withSafeArea
					? {
							paddingTop: insets.top,
							paddingBottom: insets.bottom,
						}
					: undefined
			}
			{...props}>
			<View className={`flex-1 ${withPadding ? "px-4" : ""}`}>{children}</View>
		</View>
	);
};

export default SafeArea;
