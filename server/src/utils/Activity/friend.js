const Activity = require('../../app/models/Activity');

// friend
async function createActivityWithFriendRequest(currentUser, user) {
	const activity = new Activity({
		type: 'friend',
		content: `Bạn đã gửi lời mời kết bạn ${user.fullname}`,
		link: `/profile/${user._id}`,
		target: user._id,
		user: currentUser._id,
	});
	await activity.save();
}

async function createActivityWithFriendAccept(currentUser, user) {
	const activity = new Activity({
		type: 'friend',
		content: `Bạn đã chấp nhận lời mời kết bạn ${user.fullname}`,
		link: `/profile/${user._id}`,
		target: user._id,
		user: currentUser._id,
	});
	await activity.save();
}

module.exports = {
	createActivityWithFriendRequest,
	createActivityWithFriendAccept,
};
