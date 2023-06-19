/* eslint-disable import/newline-after-import */
const AccessController = require('../app/controllers/AccessController');
const { User } = require('../app/models/User');
const SocketManager = require('./SocketManager');
const RoomMagager = require('./RoomManager');
const authMethod = require('../auth/auth.method');
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

function socket(io) {
	io.on('connection', (sk) => {
		console.log('New WS Connection...', sk.id);
		let userID;
		sk.on('login', async (token) => {
			const verified = await authMethod.verifyToken(token, accessTokenSecret);
			if (!verified) {
				console.log('Invalid token');
				return;
			}
			userID = verified.payload.userId;
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
