import React, { useState } from "react";
import {
	TextInput as RNTextInput,
	TextInputProps as RNTextInputProps,
	View,
	TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "./typography";

interface InputProps extends RNTextInputProps {
	label?: string;
	error?: string;
	hint?: string;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	disabled?: boolean;
	isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
	label,
	error,
	hint,
	leftIcon,
	rightIcon,
	disabled = false,
	isPassword = false,
	className,
	...props
}) => {
	const [isFocused, setIsFocused] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const getBorderColor = () => {
		if (error) return "border-danger-500";
		if (isFocused) return "border-primary-500";
		return "border-neutral-200";
	};

	const getBackgroundColor = () => {
		if (disabled) return "bg-neutral-100";
		return "bg-white";
	};

	return (
		<View className="w-full">
			{label && (
				<Typography variant="label" className="mb-1.5">
					{label}
				</Typography>
			)}
			<View
				className={`
          flex-row items-center
          border rounded-md px-3
          ${getBorderColor()}
          ${getBackgroundColor()}
        `}>
				{leftIcon && <View className="mr-2">{leftIcon}</View>}
				<RNTextInput
					className={`
            flex-1 py-3 text-base text-neutral-900
            ${disabled ? "text-neutral-400" : ""}
          `}
					placeholderTextColor="#94a3b8"
					editable={!disabled}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					secureTextEntry={isPassword && !showPassword}
					{...props}
				/>
				{isPassword && (
					<TouchableOpacity
						onPress={() => setShowPassword(!showPassword)}
						className="ml-2">
						<Ionicons
							name={showPassword ? "eye-off-outline" : "eye-outline"}
							size={20}
							color="#64748b"
						/>
					</TouchableOpacity>
				)}
				{rightIcon && !isPassword && <View className="ml-2">{rightIcon}</View>}
			</View>
			{error && <Typography variant="caption" color="danger" className="mt-1">{error}</Typography>}
			{hint && !error && (
				<Typography variant="caption" color="muted" className="mt-1">{hint}</Typography>
			)}
		</View>
	);
};

export default Input;
