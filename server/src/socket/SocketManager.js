const { Socket } = require('socket.io');

class SocketManager {
	constructor() {
		/** @type {Map<string, Socket>} */
		this._store = new Map();
	}

	addUser(userId, socket) {
		this._store.set(userId, socket);
	}

	removeUser(userId) {
		this._store.delete(userId);
	}

	/**
	 *
	 * @param {srting} userId user id
	 * @returns {Socket} socket
	 */
	getUser(userId) {
		return this._store.get(userId);
	}
}

module.exports = new SocketManager();
