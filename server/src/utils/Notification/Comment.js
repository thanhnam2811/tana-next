const Notification = require('../../app/models/Notification');

async function notificationCreateComment(post, comment, user) {
	const receiver = [post.author];
	const notification = new Notification({
		type: 'comment',
		content: `${user.fullname} đã bình luận một bài viết của bạn`,
		link: `/post/${post._id}/comments/${comment._id}`,
		sender: user._id,
		receiver: receiver,
	});
	await notification.save();
}

async function notificationReplyComment(commentSource, commentReply, user) {
	const receiver = [commentSource.author];
	const notification = new Notification({
		type: 'comment',
		content: `${user.fullname} đã trả lời một bình luận của bạn`,
		link: `/post/${commentSource.post}/comments/${commentReply._id}`,
		sender: user._id,
		receiver: receiver,
	});
	await notification.save();
}

async function notificationReactComment(comment, user) {
	const receiver = [comment.author];
	const notification = new Notification({
		type: 'comment',
		content: `${user.fullname} đã bày tỏ cảm xúc về một bình luận của bạn`,
		link: `/post/${comment.post}/comments/${comment._id}`,
		sender: user._id,
		receiver: receiver,
	});
	await notification.save();
}

async function notificationTagComment(comment, user) {
	const tagsInComment = comment.tags;
	if (!tagsInComment || tagsInComment.length === 0) return;
	const notification = new Notification({
		type: 'comment',
		content: `${user.fullname} đã gắn thẻ bạn trong một bình luận`,
		link: `/post/${comment.post}/comments/${comment._id}`,
		sender: user._id,
		receiver: tagsInComment,
	});
	await notification.save();
}

module.exports = {
	notificationCreateComment,
	notificationReplyComment,
	notificationReactComment,
	notificationTagComment,
};
