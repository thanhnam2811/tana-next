import SocketIOClient from 'socket.io-client';

declare global {
	interface Window {
		socket: SocketIOClient.Socket;
	}
}

declare module 'vanta/dist/vanta.net.min';
