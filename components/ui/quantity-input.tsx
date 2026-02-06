import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface QuantityInputProps {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
	value,
	onChange,
	min = 1,
	max = 99,
	disabled = false,
}) => {
	const handleDecrement = () => {
		if (value > min) {
			onChange(value - 1);
		}
	};

	const handleIncrement = () => {
		if (value < max) {
			onChange(value + 1);
		}
	};

	const canDecrement = value > min && !disabled;
	const canIncrement = value < max && !disabled;

	return (
		<View className="flex-row items-center">
			<TouchableOpacity
				onPress={handleDecrement}
				disabled={!canDecrement}
				className={`w-8 h-8 rounded-full items-center justify-center ${
					canDecrement
						? "bg-primary-100 active:bg-primary-200"
						: "bg-secondary-100"
				}`}>
				<Ionicons
					name="remove"
					size={18}
					color={canDecrement ? "#2563eb" : "#94a3b8"}
				/>
			</TouchableOpacity>

			<Text className="mx-4 text-lg font-semibold text-secondary-900 min-w-[30px] text-center">
				{value}
			</Text>

			<TouchableOpacity
				onPress={handleIncrement}
				disabled={!canIncrement}
				className={`w-8 h-8 rounded-full items-center justify-center ${
					canIncrement
						? "bg-primary-100 active:bg-primary-200"
						: "bg-secondary-100"
				}`}>
				<Ionicons
					name="add"
					size={18}
					color={canIncrement ? "#2563eb" : "#94a3b8"}
				/>
			</TouchableOpacity>
		</View>
	);
};

export default QuantityInput;
