const axios = require('axios');
const { populateUser } = require('../utils/Populate/User');
const apiKey = process.env.API_KEY_VIDEOCALL;
const Conversation = require('../app/models/Conversation');
const SocketManager = require('./SocketManager');
const eventName = require('./constant');
function RoomMagager(socket, io) {
	// socket.on('joinRoom', (conversationId) => {
	// 	console.log('joinRoom', conversationId);
	// 	socket.join(conversationId);
	// });

	// Listen for chatMessage
	socket.on(eventName.SEND_MESSAGE, async (msg) => {
		try {
			console.log('sendMessage', msg.conversation);
			const conversation = await Conversation.findById(msg.conversation);
			if (!conversation) return;
			const userIds = conversation.members
				.filter((member) => member.user.toString() !== msg.sender._id.toString())
				.map((menber) => menber.user.toString());

			SocketManager.sendToList(userIds, eventName.RECEIVE_MESSAGE, msg);
		} catch (error) {
			console.log(error);
		}
	});

	// socket.on('leaveRoom', (conversationId) => {
	// 	console.log('leaveRoom', conversationId);
	// 	socket.leave(conversationId);
	// });

	// Video call TODO: API => send event
	socket.on(eventName.CREATE_VIDEO_CALL, async (data) => {
		// data = {
		//     conversation: conversationId,
		//     caller: userId,
		// }
		const options = {
			method: 'POST',
			headers: {
				Authorization: apiKey,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				region: 'sg001',
				customRoomId: 'aaa-bbb-ccc',
				webhook: 'see example',
				autoCloseConfig: 'see example',
			}),
		};
		const url = `https://api.videosdk.live/v2/rooms`;
		const response = await axios(url, options);
		const caller = await populateUser(data.caller);

		const conversation = await Conversation.findById(data.conversation);
		if (!conversation) return;

		const userIds = conversation.members
			.filter((member) => member.user.toString() !== data.sender._id.toString())
			.map((menber) => menber.user.toString());

		SocketManager.sendToList(userIds, eventName.CREATE_VIDEO_CALL, {
			roomId: response.data.roomId,
			caller,
		});
	});

	//typing message
	socket.on(eventName.TYPING_MESSAGE, async (msg) => {
		console.log('typingMessage-----------', msg);
		const conversation = await Conversation.findById(msg.conversation);
		if (!conversation) return;

		const userIds = conversation.members
			.filter((member) => member.user.toString() !== data.sender._id.toString())
			.map((menber) => menber.user.toString());

		SocketManager.sendToList(userIds, eventName.TYPING_MESSAG, msg);
	});

	socket.on(eventName.STOP_TYPING_MESSAGE, async (msg) => {
		console.log('stopTypingMessage-----------');
		const conversation = await Conversation.findById(msg.conversation);
		if (!conversation) return;

		const userIds = conversation.members
			.filter((member) => member.user.toString() !== data.sender._id.toString())
			.map((menber) => menber.user.toString());

		SocketManager.sendToList(userIds, eventName.STOP_TYPING_MESSAGE, msg);
	});
}

module.exports = RoomMagager;
