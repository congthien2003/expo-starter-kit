import React, { createContext, useContext, ReactNode } from "react";
import { usePushNotifications, PushNotificationState } from "@/hooks/usePushNotifications";

const NotificationContext = createContext<PushNotificationState | undefined>(undefined);

interface NotificationProviderProps {
	children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
	children,
}) => {
	const notificationState = usePushNotifications();

	return (
		<NotificationContext.Provider value={notificationState}>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotificationContext = () => {
	const context = useContext(NotificationContext);
	if (context === undefined) {
		throw new Error(
			"useNotificationContext must be used within a NotificationProvider"
		);
	}
	return context;
};
