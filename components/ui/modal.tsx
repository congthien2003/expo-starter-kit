import React from "react";
import {
	Modal as RNModal,
	View,
	TouchableOpacity,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	Platform,
	Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "./typography";

type ModalVariant = "center" | "bottom";

interface ModalProps {
	visible: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	variant?: ModalVariant;
	showCloseButton?: boolean;
	closeOnBackdrop?: boolean;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const Modal: React.FC<ModalProps> = ({
	visible,
	onClose,
	title,
	children,
	variant = "center",
	showCloseButton = true,
	closeOnBackdrop = true,
}) => {
	const handleBackdropPress = () => {
		if (closeOnBackdrop) {
			onClose();
		}
	};

	const getContainerStyles = () => {
		if (variant === "bottom") {
			return "justify-end";
		}
		return "justify-center items-center";
	};

	const getContentStyles = () => {
		if (variant === "bottom") {
			return "w-full rounded-t-3xl max-h-[90%]";
		}
		return "w-[90%] max-w-md rounded-2xl max-h-[80%]";
	};

	return (
		<RNModal
			visible={visible}
			transparent
			animationType={variant === "bottom" ? "slide" : "fade"}
			onRequestClose={onClose}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="flex-1">
				<TouchableWithoutFeedback onPress={handleBackdropPress}>
					<View className={`flex-1 bg-black/50 ${getContainerStyles()}`}>
						<TouchableWithoutFeedback>
							<View className={`bg-white ${getContentStyles()}`}>
								{/* Header */}
								{(title || showCloseButton) && (
									<View className="flex-row items-center justify-between px-4 py-4 border-b border-secondary-100">
										<Typography variant="h4" className="flex-1">
											{title || ""}
										</Typography>
										{showCloseButton && (
											<TouchableOpacity
												onPress={onClose}
												className="p-1 -mr-1"
												hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
												<Ionicons name="close" size={24} color="#64748b" />
											</TouchableOpacity>
										)}
									</View>
								)}

								{/* Content */}
								<View className="px-4 py-4">{children}</View>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</RNModal>
	);
};

export default Modal;
