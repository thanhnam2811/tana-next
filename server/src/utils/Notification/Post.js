const Notification = require('../../app/models/Notification');
const SocketManager = require('../../socket/SocketManager');
const { eventName, notificationType } = require('../../socket/constant');
const { populateNotification } = require('../Populate/Notification');

async function notificationForFriends(post, user) {
	const friendsOfAuthor = user.friends.map((friend) => friend.user._id);

	const notification = await new Notification({
		type: 'post',
		content: `${user.fullname} đã đăng một bài viết mới`,
		link: `/post/${post._id}`,
		sender: user._id,
		receiver: friendsOfAuthor,
	}).save();

	// populate notification
	const popNotification = await populateNotification(notification);

	// send socket
	SocketManager.sendToList(friendsOfAuthor, eventName.NOTIFICATION, {
		type: notificationType.NEW_POST,
		data: popNotification,
	});
}

async function notificationForTags(post, user) {
	const { tags } = post;
	if (!tags || tags.length === 0) return;

	const notification = await new Notification({
		type: 'post',
		content: `${user.fullname} đã gắn thẻ bạn trong một bài viết`,
		link: `/post/${post._id}`,
		sender: user._id,
		receiver: tags,
	}).save();

	// populate notification
	const popNotification = await populateNotification(notification);

	// send socket
	SocketManager.sendToList(tags, eventName.NOTIFICATION, {
		type: notificationType.TAG_POST,
		data: popNotification,
	});
}

async function notificationForSharedPost(post, user) {
	const { sharedPost } = post;
	if (!sharedPost) return;

	const receiver = [sharedPost.author];

	const notification = await new Notification({
		type: 'post',
		content: `${user.fullname} đã chia sẻ một bài viết của bạn`,
		link: `/post/${post._id}`,
		sender: user._id,
		receiver,
	}).save();

	// populate notification
	const popNotification = await populateNotification(notification);

	// send socket
	SocketManager.send(receiver, eventName.NOTIFICATION, {
		type: notificationType.SHARE_POST,
		data: popNotification,
	});
}

async function notificationForReactPost(post, user) {
	const receiver = [post.author];
	const notification = await new Notification({
		type: 'post',
		content: `${user.fullname} đã bày tỏ cảm xúc về một bài viết của bạn`,
		link: `/post/${post._id}`,
		sender: user._id,
		receiver,
	}).save();

	// populate notification
	const popNotification = await populateNotification(notification);

	// send socket
	SocketManager.send(receiver, eventName.NOTIFICATION, {
		type: notificationType.REACT_POST,
		data: popNotification,
	});
}

module.exports = {
	notificationForFriends,
	notificationForTags,
	notificationForSharedPost,
	notificationForReactPost,
};
