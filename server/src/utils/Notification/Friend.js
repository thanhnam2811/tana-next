const Notification = require('../../app/models/Notification');

async function notificationRequestFriend(currentUser, user) {
	const friend = [user._id];
	const notification = new Notification({
		type: 'friend',
		content: `${currentUser.fullname} đã gửi lời mời kết bạn`,
		link: `/profile/${currentUser._id}`,
		sender: currentUser._id,
		receiver: friend,
	});
	await notification.save();
}

async function notificationAcceptFriend(currentUser, user) {
	const friend = [user._id];
	const notification = new Notification({
		type: 'friend',
		content: `${currentUser.fullname} đã chấp nhận lời mời kết bạn`,
		link: `/profile/${currentUser._id}`,
		sender: currentUser._id,
		receiver: friend,
	});
	await notification.save();
}

module.exports = {
	notificationRequestFriend,
	notificationAcceptFriend,
};
