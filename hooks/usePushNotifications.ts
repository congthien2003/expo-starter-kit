import { useState, useEffect } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export interface PushNotificationState {
	expoPushToken?: Notifications.ExpoPushToken;
	notification?: Notifications.Notification;
	permissionStatus?: Notifications.PermissionStatus;
}

if (Platform.OS !== "web") {
	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldPlaySound: true,
			shouldSetBadge: false,
			shouldShowBanner: true,
			shouldShowList: true,
		}),
	});
}

async function registerForPushNotificationsAsync(): Promise<{
	token?: Notifications.ExpoPushToken;
	status: Notifications.PermissionStatus;
}> {
	if (!Device.isDevice) {
		console.warn("Push notifications require a physical device.");
		return { status: Notifications.PermissionStatus.UNDETERMINED };
	}

	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#3b82f6",
		});
	}

	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;

	if (existingStatus !== "granted") {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}

	if (finalStatus !== "granted") {
		console.warn("Push notification permission not granted.");
		return { status: finalStatus };
	}

	const projectId =
		Constants?.expoConfig?.extra?.eas?.projectId ??
		Constants?.easConfig?.projectId;

	if (typeof projectId !== "string" || !projectId.trim()) {
		console.warn("Push notifications require an EAS project ID in app.json.");
		return { status: finalStatus };
	}

	try {
		const token = await Notifications.getExpoPushTokenAsync({ projectId });
		return { token, status: finalStatus };
	} catch {
		console.warn("Unable to retrieve an Expo push token. Check your network and native push configuration.");
		return { status: finalStatus };
	}
}

export const usePushNotifications = (): PushNotificationState => {
	const [expoPushToken, setExpoPushToken] = useState<
		Notifications.ExpoPushToken | undefined
	>();
	const [notification, setNotification] = useState<
		Notifications.Notification | undefined
	>();
	const [permissionStatus, setPermissionStatus] = useState<
		Notifications.PermissionStatus | undefined
	>();

	useEffect(() => {
		if (Platform.OS === "web") return;

		let active = true;
		registerForPushNotificationsAsync()
			.then(({ token, status }) => {
				if (!active) return;
				setPermissionStatus(status);
				setExpoPushToken(token);
			})
			.catch(() => {
				if (active) {
					console.warn("Unable to register for push notifications. Check native permissions and configuration.");
				}
			});

		const notificationListener =
			Notifications.addNotificationReceivedListener((notification) => {
				if (active) setNotification(notification);
			});

		const responseListener =
			Notifications.addNotificationResponseReceivedListener((_response) => {
				// TODO: handle notification tap → navigate to the relevant screen
				// Example: router.push(`/orders/${_response.notification.request.content.data.orderId}`)
			});

		return () => {
			active = false;
			notificationListener.remove();
			responseListener.remove();
		};
	}, []);

	return {
		expoPushToken,
		notification,
		permissionStatus,
	};
};
