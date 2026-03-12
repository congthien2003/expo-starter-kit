import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { s } from "react-native-size-matters";

type TypographyVariant =
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "body"
	| "body-sm"
	| "caption"
	| "label";

type TypographyColor =
	| "default"
	| "muted"
	| "primary"
	| "success"
	| "warning"
	| "danger"
	| "white";

interface TypographyProps extends TextProps {
	variant?: TypographyVariant;
	color?: TypographyColor;
	weight?: "normal" | "medium" | "semibold" | "bold";
	align?: "left" | "center" | "right";
	children: React.ReactNode;
}

const getVariantSize = (variant: TypographyVariant): number => {
	switch (variant) {
		case "h1":
			return s(30); // ~ text-3xl
		case "h2":
			return s(24); // ~ text-2xl
		case "h3":
			return s(20); // ~ text-xl
		case "h4":
			return s(18); // ~ text-lg
		case "body":
			return s(16); // ~ text-base
		case "body-sm":
			return s(14); // ~ text-sm
		case "caption":
			return s(12); // ~ text-xs
		case "label":
			return s(14); // ~ text-sm
		default:
			return s(16);
	}
};

const getColorStyles = (color: TypographyColor): string => {
	switch (color) {
		case "default":
			return "text-neutral-900";
		case "muted":
			return "text-neutral-500";
		case "primary":
			return "text-primary-600";
		case "success":
			return "text-success-500";
		case "warning":
			return "text-warning-500";
		case "danger":
			return "text-danger-500";
		case "white":
			return "text-white";
		default:
			return "text-neutral-900";
	}
};

const getWeightStyles = (weight: TypographyProps["weight"], variant: TypographyVariant): string => {
	if (weight) {
		switch (weight) {
			case "normal":
				return "font-normal";
			case "medium":
				return "font-medium";
			case "semibold":
				return "font-semibold";
			case "bold":
				return "font-bold";
		}
	}
	// Fallback to variant defaults
	switch (variant) {
		case "h1":
		case "h2":
			return "font-bold";
		case "h3":
		case "h4":
			return "font-semibold";
		case "label":
			return "font-medium";
		default:
			return "font-normal";
	}
};

const getAlignStyles = (align: TypographyProps["align"]): string => {
	switch (align) {
		case "left":
			return "text-left";
		case "center":
			return "text-center";
		case "right":
			return "text-right";
		default:
			return "";
	}
};

export const Typography: React.FC<TypographyProps> = ({
	variant = "body",
	color = "default",
	weight,
	align,
	children,
	className,
	style,
	...props
}) => {
	const fontSize = getVariantSize(variant);
	const colorStyles = getColorStyles(color);
	const weightStyles = getWeightStyles(weight, variant);
	const alignStyles = align ? getAlignStyles(align) : "";

	return (
		<Text
			className={`${colorStyles} ${weightStyles} ${alignStyles} ${className || ""}`}
			style={[style, { fontSize }]}
			{...props}>
			{children}
		</Text>
	);
};

// Convenience components
export const Heading1: React.FC<Omit<TypographyProps, "variant">> = (props) => (
	<Typography variant="h1" {...props} />
);

export const Heading2: React.FC<Omit<TypographyProps, "variant">> = (props) => (
	<Typography variant="h2" {...props} />
);

export const Heading3: React.FC<Omit<TypographyProps, "variant">> = (props) => (
	<Typography variant="h3" {...props} />
);

export const Heading4: React.FC<Omit<TypographyProps, "variant">> = (props) => (
	<Typography variant="h4" {...props} />
);

export const Body: React.FC<Omit<TypographyProps, "variant">> = (props) => (
	<Typography variant="body" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, "variant">> = (props) => (
	<Typography variant="caption" color="muted" {...props} />
);

export const Label: React.FC<Omit<TypographyProps, "variant">> = (props) => (
	<Typography variant="label" {...props} />
);

export default Typography;
