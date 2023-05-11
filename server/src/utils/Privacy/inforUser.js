const { User } = require('../../app/models/User');
const { populateUser } = require('../Populate/User');

async function getUserWithPrivacy(req) {
	try {
		const user = await populateUser(req.params.id);

		if (!user) return res.status(404).send('User not found');

		//check fields have privacy or not
		const fields = Object.keys(user._doc);
		const privacyFields = [];
		fields.forEach((field) => {
			//check user[field] is object or not
			if (typeof user[field] === 'object') {
				//check array or not
				if (Array.isArray(user[field]) && user[field].length > 0) {
					// console.log(field, 'privacy' in user[field][0], user[field][0].hasOwnProperty('privacy'));
					if ('privacy' in user[field][0]) {
						privacyFields.push(field);
					}
				} else {
					if ('privacy' in user[field]) {
						privacyFields.push(field);
					}
				}
			}
		});

		if (!req.user) {
			//user is not logged in
			privacyFields.forEach((field) => {
				//check if field is array
				if (Array.isArray(user[field])) {
					user[field] = user[field].filter((item) => item.privacy.value === 'public');
				} else {
					if (user[field].privacy.value !== 'public') {
						return;
					}
					user[field] = null;
				}
			});
			return user;
		} else if (req.user._id.toString() === req.params.id.toString()) {
			// user is owner
			return user;
		} else {
			//get relationship between user and current user have to be friends
			const isFriend = user.friends.some((friend) => friend.user._id.toString() == req.user._id.toString());
			// console.log(privacyFields);
			//check privacy of fields
			privacyFields.forEach((field) => {
				//check if field is array
				if (Array.isArray(user[field])) {
					user[field] = user[field].filter((item) => {
						//check privacy of field
						if (item.privacy.value == 'public') return true;
						else if (item.privacy.value == 'private') return false;
						else if (item.privacy.value == 'friends' && isFriend) return true;
						else if (
							item.privacy.value == 'includes' &&
							item.privacy.includes.some((id) => id == req.user._id)
						)
							return true;
						else if (
							item.privacy.value == 'excludes' &&
							!item.privacy.excludes.some((id) => id == req.user._id) &&
							isFriend
						)
							return true;
						else return false;
					});
				} else {
					//check privacy of field
					const privacy = user[field].privacy;
					if (privacy.value == 'public') {
						if (privacy.excludes.some((id) => id.toString() == req.user._id.toString())) user[field] = null;
						return;
					} else if (privacy.value == 'private') {
						user[field] = null;
						return;
					} else if (privacy.value == 'friends') {
						if (!isFriend) user[field] = null;
						return;
					} else if (privacy.value == 'includes') {
						if (!privacy.includes.some((user) => user._id == req.user._id)) user[field] = null;
						return;
					} else if (privacy.value == 'excludes') {
						if (privacy.exclues.some((user) => user._id == req.user._id) && !isFriend) user[field] = null;
						return;
					}
				}
			});
			return user;
		}
	} catch (err) {
		console.log(err);
	}
}

module.exports = {
	getUserWithPrivacy,
};
