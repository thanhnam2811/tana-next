const Notification = require('../../app/models/Notification');
const SocketManager = require('../../socket/SocketManager');
const { eventName, notificationType } = require('../../socket/constant');
const { populateNotification } = require('../Populate/Notification');

async function notificationRequestFriend(currentUser, user) {
	const friend = [user._id];
	const notification = await new Notification({
		type: 'friend',
		content: `${currentUser.fullname} đã gửi lời mời kết bạn`,
		link: `/profile/${currentUser._id}`,
		sender: currentUser._id,
		receiver: friend,
	}).save();

	// populate notification
	const popNotification = await populateNotification(notification);

	// send socket
	SocketManager.send(user._id, eventName.NOTIFICATION, {
		type: notificationType.SEND_REQUEST_FRIEND,
		data: popNotification,
	});
}

async function notificationAcceptFriend(currentUser, user) {
	const friend = [user._id];
	const notification = await new Notification({
		type: 'friend',
		content: `${currentUser.fullname} đã chấp nhận lời mời kết bạn`,
		link: `/profile/${currentUser._id}`,
		sender: currentUser._id,
		receiver: friend,
	}).save();

	// populate notification
	const popNotification = await populateNotification(notification);

	// send socket
	SocketManager.send(user._id, eventName.NOTIFICATION, {
		type: notificationType.ACCEPT_REQUEST_FRIEND,
		data: popNotification,
	});
}

module.exports = {
	notificationRequestFriend,
	notificationAcceptFriend,
};
