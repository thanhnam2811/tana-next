// const conversations = [];

// // Join user to chat
// function userJoin(id, user, conversationId) {
// 	const member = { id, user, conversationId };

// 	conversations.push(member);

// 	return member;
// }

// // Get current user
// function getCurrentUser(id) {
// 	return conversations.find((user) => user.id === id);
// }

// // User leaves chat
// function userLeave(id) {
// 	const index = conversations.findIndex((user) => user.id === id);

// 	if (index !== -1) {
// 		return conversations.splice(index, 1)[0];
// 	}
// }

// // Get room users
// function getRoomUsers(conversationId) {
// 	return users.filter((user) => user.conversationId === conversationId);
// }

// module.exports = {
// 	userJoin,
// 	getCurrentUser,
// 	userLeave,
// 	getRoomUsers,
// };
