import React from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleProp,
	View,
	ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";

interface ScreenWrapperProps {
	children: React.ReactNode;
	/**
	 * Nếu true, nội dung có thể scroll được. Phù hợp cho màn hình dài có text inputs
	 * Nếu false, sử dụng một View bình thường (ví dụ: màn hình Map, Camera, danh sách đã có FlatList)
	 * @default false
	 */
	scrollable?: boolean;
	/**
	 * Thêm padding phần dưới tương ứng với insets của máy, giúp nội dung không bị che khuất
	 * @default true
	 */
	withBottomInsets?: boolean;
	/**
	 * Thêm padding phần trên (Status bar/Notch)
	 * @default true
	 */
	withTopInsets?: boolean;
	/**
	 * Ẩn/hiện tính năng tuỳ chỉnh tự động đẩy màn hình lên khi bật Keyboard
	 * @default true
	 */
	keyboardAvoidingView?: boolean;
	/**
	 * Sử dụng Reanimated FadeIn transition khi màn hình Mount
	 * @default true
	 */
	animated?: boolean;
	/**
	 * Style bổ sung cho container ngoài cùng
	 */
	style?: StyleProp<ViewStyle>;
	/**
	 * Style bổ sung cho content container (nếu scrollable = true thì áp dụng cho ScrollView contentContainerStyle)
	 */
	contentContainerStyle?: StyleProp<ViewStyle>;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
	children,
	scrollable = false,
	withBottomInsets = true,
	withTopInsets = true,
	keyboardAvoidingView = true,
	animated = true,
	style,
	contentContainerStyle,
}) => {
	const insets = useSafeAreaInsets();

	const insetStyle = {
		paddingTop: withTopInsets ? insets.top : 0,
		paddingBottom: withBottomInsets ? insets.bottom : 0,
		paddingLeft: insets.left,
		paddingRight: insets.right,
	};

	let content = children;

	if (scrollable) {
		content = (
			<ScrollView
				showsVerticalScrollIndicator={false}
				bounces={false}
				contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}>
				{children}
			</ScrollView>
		);
	} else {
		content = (
			<View style={[{ flex: 1 }, contentContainerStyle]}>{children}</View>
		);
	}

	const Container = animated ? Animated.View : View;

	const containerContent = (
		<Container
			entering={animated ? FadeIn.duration(400) : undefined}
			style={[{ flex: 1, backgroundColor: "white" }, insetStyle, style]}>
			{content}
		</Container>
	);

	if (keyboardAvoidingView) {
		return (
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}>
				{containerContent}
			</KeyboardAvoidingView>
		);
	}

	return containerContent;
};

export default ScreenWrapper;
