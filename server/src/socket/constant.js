const eventName = {
	LOGIN: 'login',
	LOGOUT: 'logout',
	SEND_MESSAGE: 'sendMessage',
	RECEIVE_MESSAGE: 'receiveMessage',
	TYPING_MESSAGE: 'typingMessage',
	STOP_TYPING_MESSAGE: 'stopTypingMessage',
	CREATE_VIDEO_CALL: 'createVideoCall',
	NOTIFICATION: 'notification',
};

const notificationType = {
	SEND_REQUEST_FRIEND: 'sendRequestFriend',
	ACCEPT_REQUEST_FRIEND: 'acceptRequestFriend',
	NEW_POST: 'newPost',
	REACT_POST: 'reactPost',
	COMMENT_POST: 'commentPost',
	SHARE_POST: 'sharePost',
	TAG_POST: 'tagPost',
	REACT_COMMENT: 'reactComment',
	REPLY_COMMENT: 'replyComment',
	TAG_COMMENT: 'tagComment',
	DELETE_POST: 'deletePost',
	DELETE_COMMENT: 'deleteComment',
	LOCK_ACCOUNT: 'lockAccount',
	DELETE_CONVERSATION: 'deleteConversation',
};

module.exports = {
	eventName,
	notificationType,
};
