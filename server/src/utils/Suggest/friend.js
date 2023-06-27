/* eslint-disable no-useless-catch */
/* eslint-disable import/order */
const { User } = require('../../app/models/User');

const calculateCosineSimilarity = (interests1, interests2) => {
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

const suggestFriend = async (userId, limit = 10) => {
	try {
		const user = await User.findById(userId);
		const users = await User.find({ _id: { $ne: userId } });

		const userHobbies = user.hobbies;
		const usersHobbies = users.map((user) => user.hobbies);

		// Đảm bảo số lượng phần tử của hai mảng giống nhau
		const maxLength = Math.max(userHobbies.length, ...usersHobbies.map((hobbies) => hobbies.length));
		const paddedUserHobbies = userHobbies.concat(Array(maxLength - userHobbies.length).fill(''));
		const paddedOrtherUsersHobbies = usersHobbies.map((hobbies) =>
			hobbies.concat(Array(maxLength - hobbies.length).fill(''))
		);

		console.log(
			calculateCosineSimilarity(['Đi chơi', 'Đọc sách f', 'Đi câu cá'], ['Đọc sách', 'Đi chơi với người yêu'])
		);
		const similarityHobbies = paddedOrtherUsersHobbies.map((hobbies) =>
			calculateCosineSimilarity(hobbies, paddedUserHobbies)
		);
		const suggestUsers = users.map((user, index) => ({ ...user.toObject(), similarity: similarityHobbies[index] }));
		suggestUsers.sort((a, b) => b.similarity - a.similarity);
		return suggestUsers.slice(0, limit);
	} catch (error) {
		throw error;
	}
};

module.exports = suggestFriend;
