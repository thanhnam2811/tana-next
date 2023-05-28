exports.populateNotification = async (notification) => {
	return await notification.populate({
		path: 'sender',
		select: '_id  fullname profilePicture',
		populate: {
			path: 'profilePicture',
			select: '_id link',
		},
	});
};
