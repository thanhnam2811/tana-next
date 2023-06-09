const { Socket } = require('socket.io');

class SocketManager {
	constructor() {
		/** @type {Map<string, Socket>} */
		this._store = new Map();
	}

	addUser(userId, socket) {
		this._store.set(userId.toString(), socket);
	}

	removeUser(userId) {
		this._store.delete(userId.toString());
	}

	/**
	 *
	 * @param {string} userId user id
	 * @returns {Socket} socket
	 */
	getUser(userId) {
		return this._store.get(userId.toString());
	}

	send(userId, event, data) {
		const socket = this.getUser(userId);
		if (!socket) return;
		socket.emit(event, data);
	}

	sendToList(userIds, event, data) {
		userIds.forEach((userId) => {
			this.send(userId, event, data);
		});
	}
}

module.exports = new SocketManager();
