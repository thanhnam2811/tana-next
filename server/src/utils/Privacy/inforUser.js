const { populateUser, populateUserForOther } = require('../Populate/User');

async function getUserWithPrivacy(req, res) {
	try {
		let user;
		if (req.user && req.user._id.toString() === req.params.id.toString()) {
			user = await populateUser(req.params.id);
		} else {
			user = await populateUserForOther(req.params.id);
		}
		if (!user) return null;

		// check fields have privacy or not
		const fields = Object.keys(user._doc);
		const privacyFields = [];
		fields.forEach((field) => {
			if (field == 'hobbies') {
				return;
			}
			// check user[field] is object or not
			if (typeof user[field] === 'object') {
				// check array or not
				if (Array.isArray(user[field]) && user[field].length > 0) {
					// console.log(field, 'privacy' in user[field][0], user[field][0].hasOwnProperty('privacy'));
					if ('privacy' in user[field][0]) {
						privacyFields.push(field);
					}
				} else if ('privacy' in user[field]) {
					privacyFields.push(field);
				}
			}
		});

		if (!req.user) {
			// user is not logged in
			privacyFields.forEach((field) => {
				// check if field is array
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
		}
		if (req.user._id.toString() === req.params.id.toString()) {
			// user is owner
			return user;
		}
		// get relationship between user and current user have to be friends
		const isFriend = user.friends.some((friend) => friend.user._id.toString() == req.user._id.toString());
		// console.log(privacyFields);
		// check privacy of fields
		privacyFields.forEach((field) => {
			// check if field is array
			if (Array.isArray(user[field])) {
				user[field] = user[field].filter((item) => {
					// check privacy of field
					if (item.privacy.value == 'public') return true;
					if (item.privacy.value == 'private') return false;
					if (item.privacy.value == 'friends' && isFriend) return true;
					if (
						item.privacy.value == 'includes' &&
						item.privacy.includes.some((id) => id.toString() == req.user._id.toString()) &&
						isFriend
					)
						return true;
					if (
						item.privacy.value == 'excludes' &&
						!item.privacy.excludes.some((id) => id.toString() == req.user._id.toString()) &&
						isFriend
					)
						return true;
					return false;
				});
			} else {
				// check privacy of field
				const { privacy } = user[field];
				if (privacy.value == 'public') {
					if (privacy.excludes.some((id) => id.toString() == req.user._id.toString())) user[field] = null;
				} else if (privacy.value == 'private') {
					user[field] = null;
				} else if (privacy.value == 'friends') {
					if (!isFriend) user[field] = null;
				} else if (privacy.value == 'includes') {
					if (!privacy.includes.some((u) => u._id.toString() == req.user._id.toString())) user[field] = null;
				} else if (privacy.value == 'excludes') {
					if (privacy.exclues.some((u) => u._id.toString() == req.user._id.toString()) && !isFriend)
						user[field] = null;
				}
			}
		});
		return user;
	} catch (err) {
		console.log(err);
	}
}

module.exports = {
	getUserWithPrivacy,
};
