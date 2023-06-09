const moongose = require('mongoose');
const { User } = require('../../app/models/User');

exports.populateImage = async (userID) => {
	const user = await User.findById(moongose.Types.ObjectId(userID))
		.populate({ path: 'profilePicture', select: '_id link' })
		.populate({ path: 'coverPicture', select: '_id link' })
		.populate({ path: 'role', select: '_id name' });
	return user;
};

exports.populateUser = async (userID) => {
	const user = await User.findById(moongose.Types.ObjectId(userID))
		.populate({ path: 'profilePicture', select: '_id link' })
		.populate({ path: 'coverPicture', select: '_id link' })
		.populate({ path: 'friends.user', select: '_id fullname profilePicture isOnline' })
		.populate({
			path: 'education.privacy.excludes',
			select: '_id fullname profilePicture isOnline',
			populate: {
				path: 'profilePicture',
				select: '_id link',
			},
		})
		.populate({
			path: 'education.privacy.excludes',
			select: '_id fullname profilePicture isOnline',
			populate: {
				path: 'profilePicture',
				select: '_id link',
			},
		})
		.populate({
			path: 'work.privacy.excludes',
			select: '_id fullname profilePicture isOnline',
			populate: {
				path: 'profilePicture',
				select: '_id link',
			},
		})
		.populate({
			path: 'work.privacy.excludes',
			select: '_id fullname profilePicture isOnline',
			populate: {
				path: 'profilePicture',
				select: '_id link',
			},
		})
		.populate({
			path: 'contact.privacy.excludes',
			select: '_id fullname profilePicture isOnline',
			populate: {
				path: 'profilePicture',
				select: '_id link',
			},
		})
		.populate({
			path: 'contact.privacy.excludes',
			select: '_id fullname profilePicture isOnline',
			populate: {
				path: 'profilePicture',
				select: '_id link',
			},
		})
		.populate({
			path: 'gender.privacy.excludes',
			select: '_id fullname profilePicture isOnline',
			populate: {
				path: 'profilePicture',
				select: '_id link',
			},
		})
		.populate({
			path: 'gender.privacy.excludes',
			select: '_id fullname profilePicture isOnline',
			populate: {
				path: 'profilePicture',
				select: '_id link',
			},
		})
		.populate({ path: 'friendRequests.user', select: '_id fullname profilePicture isOnline' })
		.populate({ path: 'sentRequests.user', select: '_id fullname profilePicture isOnline' })
		.populate({ path: 'role', select: '_id name' });

	return user;
};

exports.populateUserByEmail = async (email) => {
	const user = await User.findOne({ email })
		.populate({ path: 'profilePicture', select: '_id link' })
		.populate({ path: 'coverPicture', select: '_id link' })
		.populate({ path: 'friends.user', select: '_id fullname profilePicture isOnline' })
		.populate({ path: 'friendRequests.user', select: '_id fullname profilePicture isOnline' })
		.populate({ path: 'sentRequests.user', select: '_id fullname profilePicture isOnline' })
		.populate({
			path: 'education.privacy.excludes',
			select: '_id fullname profilePicture isOnline',
			populate: {
				path: 'profilePicture',
				select: '_id link',
			},
		})
		.populate({
			path: 'education.privacy.excludes',
			select: '_id fullname profilePicture isOnline',
			populate: {
				path: 'profilePicture',
				select: '_id link',
			},
		})
		.populate({
			path: 'work.privacy.excludes',
			select: '_id fullname profilePicture isOnline',
			populate: {
				path: 'profilePicture',
				select: '_id link',
			},
		})
		.populate({
			path: 'work.privacy.excludes',
			select: '_id fullname profilePicture isOnline',
			populate: {
				path: 'profilePicture',
				select: '_id link',
			},
		})
		.populate({
			path: 'contact.privacy.excludes',
			select: '_id fullname profilePicture isOnline',
			populate: {
				path: 'profilePicture',
				select: '_id link',
			},
		})
		.populate({
			path: 'contact.privacy.excludes',
			select: '_id fullname profilePicture isOnline',
			populate: {
				path: 'profilePicture',
				select: '_id link',
			},
		})
		.populate({
			path: 'gender.privacy.excludes',
			select: '_id fullname profilePicture isOnline',
			populate: {
				path: 'profilePicture',
				select: '_id link',
			},
		})
		.populate({
			path: 'gender.privacy.excludes',
			select: '_id fullname profilePicture isOnline',
			populate: {
				path: 'profilePicture',
				select: '_id link',
			},
		})
		.populate({ path: 'role', select: '_id name' });

	return user;
};
