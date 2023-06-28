const Notification = require('../../app/models/Notification');
const SocketManager = require('../../socket/SocketManager');
const { eventName, notificationType } = require('../../socket/constant');
const { populateNotification } = require('../Populate/Notification');

async function notificationCreateComment(post, comment, user) {
	if (post.author.toString() === user._id.toString()) return;
	const receiver = [post.author];
	const notification = await new Notification({
		type: 'comment',
		content: `${user.fullname} đã bình luận một bài viết của bạn`,
		link: `/post/${post._id}?cid=:${comment._id}`,
		sender: user._id,
		receiver,
	}).save();

	// populate notification
	const popNotification = await populateNotification(notification);

	// send socket
	SocketManager.sendToList(receiver, eventName.NOTIFICATION, {
		type: notificationType.COMMENT_POST,
		data: popNotification,
	});
}

async function notificationReplyComment(commentSource, commentReply, user) {
	if (commentSource.author.toString() === user._id.toString()) return;
	const receiver = [commentSource.author];
	const notification = await new Notification({
		type: 'comment',
		content: `${user.fullname} đã trả lời một bình luận của bạn`,
		link: `/post/${commentSource.post}?cid=:${commentReply._id}`,
		sender: user._id,
		receiver,
	}).save();

	const popNotification = await populateNotification(notification);

	// send socket
	SocketManager.sendToList(receiver, eventName.NOTIFICATION, {
		type: notificationType.REPLY_COMMENT,
		data: popNotification,
	});
}

async function notificationReactComment(comment, user) {
	if (user._id.toString() === comment.author.toString()) return;
	const receiver = [comment.author];
	const notification = await new Notification({
		type: 'comment',
		content: `${user.fullname} đã bày tỏ cảm xúc về một bình luận của bạn`,
		link: `/post/${comment.post}?cid=:${comment._id}`,
		sender: user._id,
		receiver,
	}).save();

	const popNotification = await populateNotification(notification);

	// send socket
	SocketManager.sendToList(receiver, eventName.NOTIFICATION, {
		type: notificationType.REACT_COMMENT,
		data: popNotification,
	});
}

async function notificationTagComment(comment, user) {
	const tagsInComment = comment.tags;
	if (!tagsInComment || tagsInComment.length === 0) return;
	const notification = await new Notification({
		type: 'comment',
		content: `${user.fullname} đã gắn thẻ bạn trong một bình luận`,
		link: `/post/${comment.post}?cid=:${comment._id}`,
		sender: user._id,
		receiver: tagsInComment,
	}).save();

	const popNotification = await populateNotification(notification);

	// send socket
	SocketManager.sendToList(tagsInComment, eventName.NOTIFICATION, {
		type: notificationType.TAG_COMMENT,
		data: popNotification,
	});
}

module.exports = {
	notificationCreateComment,
	notificationReplyComment,
	notificationReactComment,
	notificationTagComment,
};
