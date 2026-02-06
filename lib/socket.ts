import { io, Socket } from "socket.io-client";
import Config from "@/constants/config";
import tokenService from "@/utils/tokenService";

let socket: Socket | null = null;

export const socketService = {
	/**
	 * Connect to socket server
	 */
	async connect(): Promise<Socket> {
		if (socket?.connected) {
			return socket;
		}

		const token = await tokenService.getAccessToken();

		socket = io(Config.SOCKET_URL, {
			auth: {
				token,
			},
			transports: ["websocket"],
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
		});

		socket.on("connect", () => {
			console.log("Socket connected:", socket?.id);
		});

		socket.on("disconnect", (reason) => {
			console.log("Socket disconnected:", reason);
		});

		socket.on("connect_error", (error) => {
			console.error("Socket connection error:", error.message);
		});

		return socket;
	},

	/**
	 * Disconnect from socket server
	 */
	disconnect(): void {
		if (socket) {
			socket.disconnect();
			socket = null;
		}
	},

	/**
	 * Get current socket instance
	 */
	getSocket(): Socket | null {
		return socket;
	},

	/**
	 * Emit event to server
	 */
	emit(event: string, data?: unknown): void {
		if (socket?.connected) {
			socket.emit(event, data);
		} else {
			console.warn("Socket not connected. Cannot emit:", event);
		}
	},

	/**
	 * Listen to event from server
	 */
	on(event: string, callback: (...args: unknown[]) => void): void {
		if (socket) {
			socket.on(event, callback);
		}
	},

	/**
	 * Remove event listener
	 */
	off(event: string, callback?: (...args: unknown[]) => void): void {
		if (socket) {
			socket.off(event, callback);
		}
	},
};

export default socketService;
