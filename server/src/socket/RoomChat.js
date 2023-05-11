function RoomChat(socket, io) {
	socket.on('joinRoom', (conversationId) => {
		console.log('joinRoom', conversationId);
		socket.join(conversationId);
	});

	// Listen for chatMessage
	socket.on('sendMessage', (msg) => {
		console.log('sendMessage', msg.conversation);
		socket.broadcast.to(msg.conversation).emit('receiveMessage', msg);
	});

	socket.on('leaveRoom', (conversationId) => {
		console.log('leaveRoom', conversationId);
		socket.leave(conversationId);
	});

	//typing message
	socket.on('typingMessage', (data) => {
		console.log('typingMessage-----------', data);
		socket.broadcast.to(data.conversation).emit('typingMessage', data);
	});

	socket.on('stopTypingMessage', (data) => {
		console.log('stopTypingMessage-----------');
		socket.broadcast.to(data.conversation).emit('stopTypingMessage', data);
	});
}

module.exports = RoomChat;
