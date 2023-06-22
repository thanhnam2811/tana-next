const Activity = require('../../app/models/Activity');

// comment
async function createActivityWithComment(comment, user) {
	const activity = new Activity({
		type: 'comment',
		content: `Bạn đã bình luận một bài viết`,
		link: `/post/${comment.post}/comments/${comment._id}`,
		comment: comment._id,
		user: user._id,
	});
	await activity.save();
}

async function createActivityWithReplyComment(comment, user) {
	const activity = new Activity({
		type: 'comment',
		content: `Bạn đã trả lời một bình luận`,
		link: `/post/${comment.post}/comments/${comment._id}`,
		comment: comment._id,
		user: user._id,
	});
	await activity.save();
}

async function createActivityWithReactComment(comment, user) {
	const activity = new Activity({
		type: 'comment',
		content: `Bạn đã bày tỏ cảm xúc về một bình luận`,
		link: `/post/${comment.post}/comments/${comment._id}`,
		comment: comment._id,
		user: user._id,
	});
	await activity.save();
}

async function createActivityWithTagComment(comment, user) {
	const activity = new Activity({
		type: 'comment',
		content: `Bạn đã gắn thẻ bạn bè trong một bình luận`,
		link: `/post/${comment.post}/comments/${comment._id}`,
		comment: comment._id,
		user: user._id,
	});
	await activity.save();
}

module.exports = {
	createActivityWithComment,
	createActivityWithReplyComment,
	createActivityWithReactComment,
	createActivityWithTagComment,
};
