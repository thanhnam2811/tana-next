const Notification = require('../../app/models/Notification');
const SocketManager = require('../../socket/SocketManager');
const { eventName, notificationType } = require('../../socket/constant');
const { populateNotification } = require('../Populate/Notification');

async function notificationToAuthorOfPost(post, admin) {
	const receiver = [post.author._id];
	const notification = await new Notification({
		type: 'post',
		content: `Bài viết của bạn đã bị xóa do vị phạm tiêu chuẩn công đồng`,
		link: `/posts/${post._id}`,
		sender: admin._id,
		receiver,
	}).save();

	// populate notification
	const popNotification = await populateNotification(notification);

	// send socket
	SocketManager.send(receiver, eventName.NOTIFICATION, {
		type: notificationType.DELETE_POST,
		data: popNotification,
	});
}

async function notificationToAuthorOfComment(post, comment, admin) {
	const receiver = [comment.author._id];
	const notification = await new Notification({
		type: 'comment',
		content: `Bình luận của bạn đã bị xóa do vị phạm tiêu chuẩn công đồng`,
		link: `/posts/${post._id}/comments/${comment._id}`,
		sender: admin._id,
		receiver,
	}).save();

	// populate notification
	const popNotification = await populateNotification(notification);

	// send socket
	SocketManager.send(receiver, eventName.NOTIFICATION, {
		type: notificationType.DELETE_COMMENT,
		data: popNotification,
	});
}

async function notificationToUser(user, admin) {
	const receiver = [user._id];
	const notification = await new Notification({
		type: 'user',
		content: `Tài khoản của bạn đã bị khóa do vi phạm tiêu chuẩn cộng đồng`,
		link: `/profile/${user._id}`,
		sender: admin._id,
		receiver,
	}).save();

	// populate notification
	const popNotification = await populateNotification(notification);

	// send socket
	SocketManager.send(receiver, eventName.NOTIFICATION, {
		type: notificationType.LOCK_ACCOUNT,
		data: popNotification,
	});
}

async function notificationToMembersOfConv(conversation, admin) {
	const receiver = conversation.members;
	const notification = await new Notification({
		type: 'conversation',
		content: `Cuộc trò chuyện của bạn đã bị xóa do vị phạm tiêu chuẩn công đồng`,
		link: `/conversations/${conversation._id}`,
		sender: admin._id,
		receiver,
	}).save();

	// populate notification
	const popNotification = await populateNotification(notification);

	// send socket
	SocketManager.send(receiver, eventName.NOTIFICATION, {
		type: notificationType.DELETE_CONVERSATION,
		data: popNotification,
	});
}

module.exports = {
	notificationToAuthorOfPost,
	notificationToAuthorOfComment,
	notificationToUser,
	notificationToMembersOfConv,
};
