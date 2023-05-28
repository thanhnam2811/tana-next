const axios = require('axios');
const { populateUser } = require('../utils/Populate/User');
const apiKey = process.env.API_KEY_VIDEOCALL;
const Conversation = require('../app/models/Conversation');
const SocketManager = require('./SocketManager');

function RoomChat(socket, io) {
	// socket.on("joinRoom", (conversationId) => {
	//     console.log("joinRoom", conversationId);
	//     socket.join(conversationId);
	// });

	// Listen for chatMessage
	socket.on('sendMessage', async (msg) => {
		try {
			console.log('sendMessage', msg.conversation);
			const conversation = await Conversation.findById(msg.conversation);
			if (!conversation) return;

			SocketManager.sendToList(
				conversation.members.filter((member) => member.user.toString() !== msg.sender._id.toString()),
				'receiveMessage',
				msg
			);
		} catch (error) {
			console.log(error);
		}
	});

	// socket.on("leaveRoom", (conversationId) => {
	//     console.log("leaveRoom", conversationId);
	//     socket.leave(conversationId);
	// });

	// Video call
	socket.on('createVideoCall', async (data) => {
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

		const conversation = await Conversation.findById(msg.conversation);
		if (!conversation) return;

		SocketManager.sendToList(
			conversation.members.filter((member) => member.user.toString() !== data.sender._id.toString()),
			'receiveMescreateVideoCallsage',
			{
				roomId: response.data.roomId,
				caller,
			}
		);
	});

	//typing message
	socket.on('typingMessage', async (msg) => {
		console.log('typingMessage-----------', data);
		const conversation = await Conversation.findById(data.conversation);
		if (!conversation) return;

		SocketManager.sendToList(
			conversation.members.filter((member) => member.user.toString() !== msg.sender._id.toString()),
			'typingMessage',
			msg
		);
	});

	socket.on('stopTypingMessage', async (msg) => {
		console.log('stopTypingMessage-----------');
		const conversation = await Conversation.findById(data.conversation);
		if (!conversation) return;

		SocketManager.sendToList(
			conversation.members.filter((member) => member.user.toString() !== msg.sender._id.toString()),
			'stopTypingMessage',
			msg
		);
	});
}

module.exports = RoomChat;
