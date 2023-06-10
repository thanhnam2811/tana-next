const AccessController = require('../app/controllers/AccessController');
const { User } = require('../app/models/User');
const SocketManager = require('./SocketManager');
const RoomMagager = require('./RoomManager');

function socket(io) {
	io.on('connection', (sk) => {
		console.log('New WS Connection...', sk.id);
		let userID;
		sk.on('login', async (data) => {
			userID = data;
			// console.log('online', userID);
			try {
				// data is userID
				await AccessController.updateAccessInDay();

				// Update user isOnline
				await User.findByIdAndUpdate(userID, {
					isOnline: true,
				});

				// Add user to socket manager
				SocketManager.addUser(userID, sk);
			} catch (err) {
				console.log(err);
			}
		});

		RoomMagager(sk, io);

		// Runs when client disconnects
		sk.on('disconnect', async () => {
			// console.log('Client disconnected', userID);
			try {
				// Update user isOnline
				await User.findByIdAndUpdate(userID, {
					isOnline: false,
					lastAccess: Date.now(),
				});

				// Remove user from socket manager
				SocketManager.removeUser(userID);
			} catch (err) {
				console.log(err);
			}
		});
	});
}

module.exports = socket;
