import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export interface PushNotificationState {
	expoPushToken?: Notifications.ExpoPushToken;
	notification?: Notifications.Notification;
	permissionStatus?: Notifications.PermissionStatus;
}

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldPlaySound: true,
		shouldShowAlert: true,
		shouldSetBadge: false,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
});

async function registerForPushNotificationsAsync(): Promise<{
	token?: Notifications.ExpoPushToken;
	status: Notifications.PermissionStatus;
}> {
	if (!Device.isDevice) {
		console.warn("Push notifications require a physical device.");
		return { status: "denied" as Notifications.PermissionStatus };
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

	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#3b82f6",
		});
	}

	const projectId =
		Constants?.expoConfig?.extra?.eas?.projectId ??
		Constants?.easConfig?.projectId;

	const token = await Notifications.getExpoPushTokenAsync({ projectId });
	return { token, status: finalStatus };
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

	const notificationListener = useRef<Notifications.Subscription>();
	const responseListener = useRef<Notifications.Subscription>();

	useEffect(() => {
		registerForPushNotificationsAsync().then(({ token, status }) => {
			setPermissionStatus(status);
			if (token) {
				setExpoPushToken(token);
			}
		});

		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				setNotification(notification);
			});

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener((_response) => {
				// TODO: handle notification tap → navigate to the relevant screen
				// Example: router.push(`/orders/${_response.notification.request.content.data.orderId}`)
			});

		return () => {
			notificationListener.current?.remove();
			responseListener.current?.remove();
		};
	}, []);

	return {
		expoPushToken,
		notification,
		permissionStatus,
	};
};
