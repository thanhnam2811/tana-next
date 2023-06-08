exports.populateNotification = (notification) =>
	notification.populate({
		path: 'sender',
		select: '_id  fullname profilePicture',
		populate: {
			path: 'profilePicture',
			select: '_id link',
		},
	});
