import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // Assuming this exists
import { ScreenWrapper } from "@/components/ui/screen-wrapper";
import { Typography } from "@/components/ui/typography";
import { router } from "expo-router";
import { View } from "react-native";

// Mock data
const RECENT_TRANSACTIONS = [
	{
		id: 1,
		title: "Starbucks Coffee",
		amount: "-$4.50",
		date: "Today",
		icon: "cafe",
		color: "#F59E0B",
	},
	{
		id: 2,
		title: "Salary Deposit",
		amount: "+$3,200.00",
		date: "Yesterday",
		icon: "business",
		color: "#10B981",
	},
	{
		id: 3,
		title: "Netflix Subscription",
		amount: "-$14.99",
		date: "Mar 12",
		icon: "play-circle",
		color: "#EF4444",
	},
	{
		id: 4,
		title: "Amazon Prime",
		amount: "-$12.99",
		date: "Mar 10",
		icon: "cart",
		color: "#3B82F6",
	},
	{
		id: 5,
		title: "Uber Ride",
		amount: "-$24.50",
		date: "Mar 8",
		icon: "car",
		color: "#6366F1",
	},
	{
		id: 6,
		title: "Grocery Store",
		amount: "-$142.30",
		date: "Mar 5",
		icon: "basket",
		color: "#8B5CF6",
	},
] as const;

export default function DemoHomeScreen() {
	return (
		<ScreenWrapper scrollable={true} style={{ backgroundColor: "#F3F4F6" }}>
			<View className="flex-1 pb-10">
				{/* Top Header Section - Background Primary */}
				<View className="bg-primary-600 pt-6 pb-12 px-6 rounded-b-[32px]">
					<View className="flex-row justify-between items-center mb-8">
						<View>
							<Typography
								variant="body-sm"
								color="white"
								className="opacity-80">
								Chào buổi sáng,
							</Typography>
							<Typography
								variant="h3"
								color="white"
								weight="bold">
								Thái Công Thiện
							</Typography>
						</View>
						<Button
							variant="ghost"
							className="w-12 h-12 bg-white/20 rounded-full p-0 items-center justify-center"
							onPress={() => router.back()}>
							<Ionicons
								name="notifications"
								size={20}
								color="white"
							/>
						</Button>
					</View>

					<Typography
						variant="body"
						color="white"
						className="opacity-80 mb-1">
						Total Balance
					</Typography>
					<Typography
						variant="h1"
						color="white"
						weight="bold"
						className="text-4xl">
						$14,234.50
					</Typography>
				</View>

				{/* Quick Actions Card - Overlapping header */}
				<View className="px-6 -mt-8 mb-8">
					<Card className="flex-row justify-between py-5 px-6 rounded-2xl bg-white shadow-sm border-0">
						<View className="items-center gap-2">
							<View className="w-12 h-12 rounded-full bg-primary-100 items-center justify-center">
								<Ionicons
									name="arrow-up"
									size={20}
									color="#0a7ea4"
								/>
							</View>
							<Typography variant="caption" weight="medium">
								Send
							</Typography>
						</View>
						<View className="items-center gap-2">
							<View className="w-12 h-12 rounded-full bg-success-100 items-center justify-center">
								<Ionicons
									name="arrow-down"
									size={20}
									color="#10B981"
								/>
							</View>
							<Typography variant="caption" weight="medium">
								Receive
							</Typography>
						</View>
						<View className="items-center gap-2">
							<View className="w-12 h-12 rounded-full bg-warning-100 items-center justify-center">
								<Ionicons
									name="qr-code"
									size={20}
									color="#F59E0B"
								/>
							</View>
							<Typography variant="caption" weight="medium">
								Scan
							</Typography>
						</View>
						<View className="items-center gap-2">
							<View className="w-12 h-12 rounded-full bg-neutral-100 items-center justify-center">
								<Ionicons
									name="ellipsis-horizontal"
									size={20}
									color="#6B7280"
								/>
							</View>
							<Typography variant="caption" weight="medium">
								More
							</Typography>
						</View>
					</Card>
				</View>

				{/* Recent Activity List */}
				<View className="px-6">
					<View className="flex-row justify-between items-end mb-4">
						<Typography variant="h3" weight="bold">
							Recent Activity
						</Typography>
						<Typography
							variant="body-sm"
							color="primary"
							weight="semibold">
							See All
						</Typography>
					</View>

					<View className="gap-3">
						{RECENT_TRANSACTIONS.map((tx) => (
							<Card
								key={tx.id}
								className="flex-row items-center justify-between p-4 rounded-xl bg-white shadow-sm border-0">
								<View className="flex-row items-center gap-4">
									<View
										className="w-12 h-12 rounded-full items-center justify-center"
										style={{
											backgroundColor: `${tx.color}15`,
										}}>
										<Ionicons
											name={tx.icon}
											size={20}
											color={tx.color}
										/>
									</View>
									<View>
										<Typography
											variant="body"
											weight="semibold"
											className="mb-0.5">
											{tx.title}
										</Typography>
										<Typography
											variant="caption"
											color="muted">
											{tx.date}
										</Typography>
									</View>
								</View>
								<Typography
									variant="body"
									weight="bold"
									color={
										tx.amount.startsWith("+")
											? "success"
											: "default"
									}>
									{tx.amount}
								</Typography>
							</Card>
						))}
					</View>
				</View>
			</View>
		</ScreenWrapper>
	);
}
