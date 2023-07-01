/* eslint-disable no-useless-catch */
/* eslint-disable import/order */
const { User } = require('../../app/models/User');
const { getPagination } = require('../Pagination');
const createError = require('http-errors');

const calculateCosineSimilarity = (interests1, interests2) => {
	console.log(interests1, interests2);
	const set1 = new Set(interests1);
	const set2 = new Set(interests2);
	const combinedSet = new Set([...set1, ...set2]);

	const vector1 = Array.from(combinedSet).map((interest) => (set1.has(interest) ? 1 : 0));
	const vector2 = Array.from(combinedSet).map((interest) => (set2.has(interest) ? 1 : 0));

	let dotProduct = 0;
	for (let i = 0; i < vector1.length; i++) {
		dotProduct += vector1[i] * vector2[i];
	}

	const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val ** 2, 0));
	const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val ** 2, 0));

	const similarity = dotProduct / (magnitude1 * magnitude2);
	return similarity;
};

const suggestFriend = async (req, res, next) => {
	try {
		const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);

		const userId = req.user._id;
		const user = await User.findById(userId);
		const listFriendsOfUser = user.friends.map((friend) => friend.user);
		listFriendsOfUser.push(userId);

		const query = [{ $match: { _id: { $nin: listFriendsOfUser } } }];
		if (req.query.key) {
			query.push({
				$match: {
					$or: [
						{ fullname: { $regex: req.query.key, $options: 'i' } },
						{ email: { $regex: req.query.key, $options: 'i' } },
						{ city: { $regex: req.query.key, $options: 'i' } },
						{ from: { $regex: req.query.key, $options: 'i' } },
					],
				},
			});
		}
		User.aggregate(query)
			.skip(offset)
			.limit(limit)
			.exec((err, data) => {
				if (err) {
					console.log(err);
					return next(
						createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`)
					);
				}
				const userHobbies = user.hobbies ?? [];
				const usersHobbies = data.map((user) => user.hobbies ?? []);

				// Đảm bảo số lượng phần tử của hai mảng giống nhau
				const maxLength = Math.max(userHobbies.length, ...usersHobbies.map((hobbies) => hobbies.length));
				const paddedUserHobbies = userHobbies.concat(Array(maxLength - userHobbies.length).fill(''));
				const paddedOrtherUsersHobbies = usersHobbies.map((hobbies) =>
					hobbies.concat(Array(maxLength - hobbies.length).fill(''))
				);

				const similarityHobbies = paddedOrtherUsersHobbies.map((hobbies) =>
					calculateCosineSimilarity(hobbies, paddedUserHobbies)
				);
				const suggestUsers = data.map((user, index) => ({ ...user, similarity: similarityHobbies[index] }));
				suggestUsers.sort((a, b) => b.similarity - a.similarity);
				return suggestUsers.slice(offset, offset + limit);
			});
	} catch (error) {
		throw error;
	}
};

module.exports = {
	suggestFriend,
	calculateCosineSimilarity,
};
