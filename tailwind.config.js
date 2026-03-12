/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
		"./features/**/*.{js,jsx,ts,tsx}",
	],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				primary: {
					50: "#eff6ff",
					100: "#dbeafe",
					500: "#3b82f6",
					600: "#2563eb",
					900: "#1e3a8a",
				},
				neutral: {
					50: "#f8fafc",
					100: "#f1f5f9",
					200: "#e2e8f0",
					400: "#94a3b8",
					600: "#475569",
					800: "#1e293b",
					900: "#0f172a",
				},
				success: {
					100: "#dcfce7",
					500: "#22c55e",
				},
				warning: {
					100: "#fef9c3",
					500: "#eab308",
				},
				danger: {
					100: "#fee2e2",
					500: "#ef4444",
				},
			},
			spacing: {
				1: "4px",
				2: "8px",
				3: "12px",
				4: "16px",
				5: "20px",
				6: "24px",
				8: "32px",
			},
			borderRadius: {
				sm: "4px",
				md: "8px",
				lg: "12px",
				xl: "16px",
				"2xl": "24px",
			},
		},
	},
	plugins: [],
};
