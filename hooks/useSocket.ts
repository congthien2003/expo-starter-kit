import { useEffect, useCallback, useState } from "react";
import socketService from "@/lib/socket";
import { Socket } from "socket.io-client";

interface UseSocketOptions {
	autoConnect?: boolean;
}

interface UseSocketReturn {
	socket: Socket | null;
	isConnected: boolean;
	connect: () => Promise<void>;
	disconnect: () => void;
	emit: (event: string, data?: unknown) => void;
	on: (event: string, callback: (...args: unknown[]) => void) => void;
	off: (event: string, callback?: (...args: unknown[]) => void) => void;
}

export const useSocket = (options: UseSocketOptions = {}): UseSocketReturn => {
	const { autoConnect = false } = options;
	const [isConnected, setIsConnected] = useState(false);
	const [socket, setSocket] = useState<Socket | null>(null);

	const connect = useCallback(async () => {
		try {
			const connectedSocket = await socketService.connect();
			setSocket(connectedSocket);

			connectedSocket.on("connect", () => {
				setIsConnected(true);
			});

			connectedSocket.on("disconnect", () => {
				setIsConnected(false);
			});
		} catch (error) {
			console.error("Socket connection error:", error);
		}
	}, []);

	const disconnect = useCallback(() => {
		socketService.disconnect();
		setSocket(null);
		setIsConnected(false);
	}, []);

	const emit = useCallback((event: string, data?: unknown) => {
		socketService.emit(event, data);
	}, []);

	const on = useCallback(
		(event: string, callback: (...args: unknown[]) => void) => {
			socketService.on(event, callback);
		},
		[],
	);

	const off = useCallback(
		(event: string, callback?: (...args: unknown[]) => void) => {
			socketService.off(event, callback);
		},
		[],
	);

	useEffect(() => {
		if (autoConnect) {
			connect();
		}

		return () => {
			// Cleanup on unmount
			disconnect();
		};
	}, [autoConnect, connect, disconnect]);

	return {
		socket,
		isConnected,
		connect,
		disconnect,
		emit,
		on,
		off,
	};
};

export default useSocket;
