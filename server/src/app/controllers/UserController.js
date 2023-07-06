/* eslint-disable no-lonely-if */
/* eslint-disable import/order */
const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');
const createError = require('http-errors');
const { User, validate } = require('../models/User');
const { getPagination } = require('../../utils/Pagination');
const { populateUser } = require('../../utils/Populate/User');
const { getUserWithPrivacy } = require('../../utils/Privacy/inforUser');
const { getListUser, getListData, getListPost } = require('../../utils/Response/listData');
const { notificationRequestFriend, notificationAcceptFriend } = require('../../utils/Notification/Friend');
const { createActivityWithFriendRequest, createActivityWithFriendAccept } = require('../../utils/Activity/friend');
const moment = require('moment');
const { calculateCosineSimilarity } = require('../../utils/Suggest/friend');
const { responseError } = require('../../utils/Response/error');

function querySearchAllUsers(req) {
	try {
		const query = [{ $match: { _id: { $ne: req.user._id } } }];

		if (req.query.age) {
			// convert age to date
			const age = parseInt(req.query.age);
			const date = new Date();
			date.setFullYear(date.getFullYear() - age);
			// create query to filter by birthdate > date
			query.push({ $match: { birthdate: { $lte: date } } });
		}

		return query;
	} catch (err) {
		console.log(err.message);
	}
}

async function querySearchSuggestFriends(req, next) {
	try {
		const listFriendsOfUser = req.user.friends.map((friend) => friend.user._id);
		const friendsOfUser = await User.find({ _id: { $in: listFriendsOfUser } });
		const friendsOfFriends = friendsOfUser.flatMap((friend) => friend.friends.map((f) => f.user._id));
		const uniqueFriendsOfFriends = [...new Set(friendsOfFriends)];

		// remove user current, user's friends, user's friendsRequest, user's sentRequests
		const listRequestsOfUser = req.user.friendRequests.map((f) => f.user._id);

		// const listSentRequestsOfUser = req.user.sentRequests.map(friend => friend.user._id);
		const listSentRequestsOfUser = req.user.sentRequests.map((f) => f.user._id);

		const friendsOfFriendsFilter = uniqueFriendsOfFriends.filter(
			(friendId) =>
				friendId.toString() !== req.user._id.toString() &&
				!listRequestsOfUser.some((requestID) => requestID && requestID.toString() === friendId.toString()) &&
				!listFriendsOfUser.some((friendID) => friendID && friendID.toString() === friendId.toString()) &&
				!listSentRequestsOfUser.some(
					(sentRequestID) => sentRequestID && sentRequestID.toString() === friendId.toString()
				)
		);

		const cityUser = req.user.city ? req.user.city.province : '';
		const fromUser = req.user.from ? req.user.from.province : '';

		// TODO: education and work is array
		const schoolUser = req.user.education.school ? req.user.education.school : '';
		const companyUser = req.user.work.company ? req.user.work.company : '';

		const query = [
			{
				$match: {
					$or: [
						{ _id: { $in: friendsOfFriendsFilter } },
						{
							$and: [
								{
									$or: [
										{ 'city.province': { $regex: cityUser, $options: 'i' } },
										{ 'from.province': { $regex: fromUser, $options: 'i' } },
										// 		{ 'education.school': { $regex: schoolUser, $options: 'i' } },
										// 		{ 'work.company': { $regex: companyUser, $options: 'i' } },
									],
								},
								{ _id: { $nin: friendsOfFriendsFilter } },
								{ _id: { $nin: listFriendsOfUser } },
								{ _id: { $nin: listRequestsOfUser } },
								{ _id: { $nin: listSentRequestsOfUser } },
							],
						},
					],
				},
			},
			{
				$match: { _id: { $ne: req.user._id } },
			},
		];

		if (req.query.age) {
			// convert age to date
			const age = parseInt(req.query.age);
			const date = new Date();
			date.setFullYear(date.getFullYear() - age);
			// create query to filter by birthdate > date
			query.push({ $match: { birthdate: { $lte: date } } });
		}

		return query;
	} catch (err) {
		console.log(err);
		return next(
			createError.InternalServerError(
				`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
					req.body,
					null,
					2
				)}`
			)
		);
	}
}
class UserController {
	// [PUT] update user
	async update(req, res, next) {
		try {
			// validate data
			const { error } = validate(req.body);
			if (error) return res.status(400).send(error.details[0].message);

			const user = await User.findByIdAndUpdate(
				req.user._id,
				{
					$set: req.body,
				},
				{ new: true }
			)
				.populate({ path: 'profilePicture', select: '_id link' })
				.populate({ path: 'coverPicture', select: '_id link' })
				.populate({ path: 'role', select: '_id name' });
			res.status(200).json(user);
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// [GET]
	async suggestFriends(req, res, next) {
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
							createError.InternalServerError(
								`${err.message} in method: ${req.method} of ${req.originalUrl}`
							)
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
					return res.status(200).send({
						totalItems: suggestUsers.length,
						items: suggestUsers.slice(offset, offset + limit),
						totalPages: Math.ceil(suggestUsers.length / limit),
						currentPage: Math.floor(offset / limit),
						offset,
					});
				});
		} catch (error) {
			console.log(error);
			return next(
				createError.InternalServerError(
					`${error.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// [PUT] set password
	async setPassword(req, res, next) {
		try {
			if (req.params.id.toString() === req.user._id.toString()) {
				const user = await User.findById(req.params.id);
				if (user.password) {
					return res
						.status(403)
						.json(
							'Bạn đã đặt mật khẩu cho tài khoản này rồi. Vui lòng đăng nhập bằng mật khẩu và thay đổi mật khẩu mới.'
						);
				}
				const salt = await bcrypt.genSalt(10);
				const hashedPassword = await bcrypt.hash(req.body.password, salt);
				const updatedUser = await User.findByIdAndUpdate(
					req.params.id,
					{
						$set: { password: hashedPassword },
					},
					{ new: true }
				);
				res.status(200).json(updatedUser);
			} else {
				return res.status(403).json('Bạn chỉ có thể đặt mật khẩu cho tài khoản của bạn!!!!');
			}
		} catch (err) {
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// [PUT] update password
	async updatePassword(req, res, next) {
		try {
			if (req.params.id.toString() === req.user._id.toString()) {
				const user = await User.findById(req.params.id);
				const validPassword = await bcrypt.compare(req.body.oldPassword, user.password);
				if (!validPassword) {
					return res.status(403).json('Mật khẩu cũ không đúng!!!');
				}
				const salt = await bcrypt.genSalt(10);
				const hashPassword = await bcrypt.hash(req.body.newPassword, salt);
				await User.findByIdAndUpdate(req.params.id, {
					$set: { password: hashPassword },
				});
				res.status(200).json('Cập nhật mật khẩu thành công!!!');
			} else {
				return res.status(403).json('Bạn chỉ có thể cập nhật thông tin tài khoản của bạn!!!!');
			}
		} catch (err) {
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// delete user
	async delete(req, res, next) {
		if (req.user._id === req.params.id || req.user.role.name === 'ADMIN') {
			try {
				const user = await User.findByIdAndDelete(req.params.id);
				res.status(200).send({
					message: 'Xóa tài khoản thành công!!!',
					user,
				});
			} catch (err) {
				return next(
					createError.InternalServerError(
						`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
							req.body,
							null,
							2
						)}`
					)
				);
			}
		} else {
			return res.status(403).json('You can delete only your account!');
		}
	}

	// get a user
	async getUser(req, res, next) {
		const { userId } = req.query;
		const { email } = req.query;
		try {
			const user = userId ? await User.findById(userId) : await User.findOne({ email });
			// const { password, updatedAt, ...other } = user._doc;
			res.status(200).json(user);
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// get user by id
	async getUserById(req, res, next) {
		try {
			const user = await User.findById(req.params.id)
				.populate({ path: 'profilePicture', select: '_id link' })
				.populate({ path: 'coverPicture', select: '_id link' });
			if (user) {
				res.status(200).json(user);
			} else {
				return responseError(res, 404, 'Không tìm thấy người dùng!!!');
			}
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// send friend request
	async sendFriendRequest(req, res, next) {
		try {
			if (req.params.id.toString() !== req.user._id.toString()) {
				const user = await User.findById(req.params.id);
				const currentUser = await User.findById(req.user._id);
				// check arrray object friends of currentUser has user._id or not
				if (currentUser.friends.some((friend) => friend.user.toString() === req.params.id)) {
					res.status(403).json('Hai người đã là bạn bè!!!');
				} else if (
					currentUser.friendRequests.some((friendRequest) => friendRequest.user.toString() === req.params.id)
				) {
					res.status(403).json('Nguời này đã gửi yêu cầu kết bạn cho bạn rồi. Vui lòng chấp nhận yêu cầu!!!');
				} else if (
					!currentUser.sentRequests.some((sentRequest) => sentRequest.user.toString() === req.params.id)
				) {
					await user.updateOne({
						$push: { friendRequests: { user: currentUser._id }, followers: { user: currentUser._id } },
					});
					await currentUser.updateOne({
						$push: { sentRequests: { user: user._id }, followings: { user: user._id } },
					});
					// send notification
					await notificationRequestFriend(currentUser, user);

					// create activity
					await createActivityWithFriendRequest(currentUser, user);

					res.status(200).json('Gửi yêu cầu kết bạn thành công!!!');
				} else {
					// cancel friend request
					await user.updateOne({
						$pull: { friendRequests: { user: currentUser._id }, followers: { user: currentUser._id } },
					});
					await currentUser.updateOne({
						$pull: { sentRequests: { user: user._id }, followings: { user: user._id } },
					});
					res.status(200).json('Hủy yêu cầu kết bạn thành công!!!');
				}
			} else {
				return res.status(403).json('Bạn không thể gửi yêu cầu kết bạn cho chính mình!!!');
			}
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// accept friend request
	async acceptFriendRequest(req, res, next) {
		try {
			if (req.params.id.toString() !== req.user._id.toString()) {
				const user = await User.findById(req.params.id);
				const currentUser = await User.findById(req.user._id);
				if (
					currentUser.friendRequests.some((friendRequest) => friendRequest.user.toString() === req.params.id)
				) {
					// update friend request, send friend request and followers, following
					await user.updateOne({ $pull: { sentRequests: { user: currentUser._id } } });
					await user.updateOne({
						$push: { friends: { user: currentUser._id }, followings: { user: currentUser._id } },
					});
					await currentUser.updateOne({ $pull: { friendRequests: { user: user._id } } });
					await currentUser.updateOne({
						$push: { friends: { user: user._id }, followers: { user: user._id } },
					});
					// send notification
					await notificationAcceptFriend(currentUser, user);

					// create activity
					await createActivityWithFriendAccept(currentUser, user);

					res.status(200).json('Kết bạn thành công!!!');
				} else {
					return responseError(res, 403, 'Bạn không thể chấp nhận yêu cầu kết bạn này!!!');
				}
			} else {
				return responseError(res, 403, 'Bạn không thể chấp nhận yêu cầu kết bạn của chính mình!!!');
			}
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// reject friend request
	async rejectFriendRequest(req, res, next) {
		try {
			if (req.params.id.toString() !== req.user._id.toString()) {
				const user = await User.findById(req.params.id);
				const currentUser = await User.findById(req.user._id);
				if (
					currentUser.friendRequests.some((friendRequest) => friendRequest.user.toString() === req.params.id)
				) {
					// update friend request, send friend request and followers, following
					await user.updateOne({
						$pull: { sentRequests: { user: currentUser._id }, followings: { user: currentUser._id } },
					});
					await currentUser.updateOne({ $pull: { friendRequests: { user: user._id } } });
					res.status(200).json('Từ chối yêu cầu kết bạn thành công!!!');
				} else {
					return responseError(res, 403, 'Bạn không thể từ chối yêu cầu kết bạn này!!!');
				}
			} else {
				return responseError(res, 403, 'Bạn không thể từ chối yêu cầu kết bạn của chính mình!!!');
			}
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// unfriend
	async unfriend(req, res, next) {
		try {
			if (req.params.id.toString() !== req.user._id.toString()) {
				const user = await User.findById(req.params.id);
				const currentUser = await User.findById(req.user._id);
				if (currentUser.friends.some((friend) => friend.user.toString() === req.params.id)) {
					// update friend request, send friend request and followers, following
					await user.updateOne({
						$pull: {
							friends: { user: currentUser._id },
							followings: { user: currentUser._id },
							followers: { user: currentUser._id },
						},
					});
					await currentUser.updateOne({
						$pull: {
							friends: { user: user._id },
							followers: { user: user._id },
							followings: { user: user._id },
						},
					});
					res.status(200).json('Hủy kết bạn thành công!!!');
				} else {
					res.status(403).json('Bạn không thể hủy kết bạn với người này!!!');
				}
			} else {
				return res.status(403).json('Bạn không thể hủy kết bạn với chính mình!!!');
			}
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	async getFriendsList(req, res, next) {
		try {
			// pagination
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			let sort = 'desc';
			if (req.query.sort) {
				sort = req.query.sort;
			}
			const listIDFirends = req.user.friends.map((friend) => friend.user);
			const query = [{ _id: { $in: listIDFirends }, $sort: { 'friends.date': sort } }];
			if (req.query.gender) {
				query.push({ 'gender.value': { $eq: req.query.gender } });
			}
			if (req.query.age) {
				// convert age to date
				const age = parseInt(req.query.age);
				const date = new Date();
				date.setFullYear(date.getFullYear() - age);
				// create query to filter by birthdate > date
				query.push({ birthdate: { $lte: date } });
			}
			if (req.query.key) {
				query.push({
					$or: [
						{ fullname: { $regex: req.query.key, $options: 'i' } },
						{ email: { $regex: req.query.key, $options: 'i' } },
						{ city: { $regex: req.query.key, $options: 'i' } },
						{ from: { $regex: req.query.key, $options: 'i' } },
					],
				});
			}

			User.paginate(
				{ $and: query },
				{
					offset,
					limit,
					populate: [
						{ path: 'profilePicture', select: '_id url' },
						{ path: 'coverPicture', select: '_id url' },
					],
				}
			)
				.then((data) => {
					getListData(res, data);
				})
				.catch((err) => {
					console.log(err);
					return next(
						createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`)
					);
				});
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// search friends by type
	async searchFriends(req, res, next) {
		try {
			// pagination
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);

			let sort = 'desc'; // default sort
			if (req.query.sort) {
				sort = req.query.sort;
			}

			const { type } = req.params;
			let query = [];
			if (type === 'all') {
				query = querySearchAllUsers(req);
			} else if (type === 'friends') {
				// get all user of friends to list by oder by date
				let listFriendsOfUser = [];
				if (sort == 'desc') {
					listFriendsOfUser = req.user.friends.sort((a, b) => b.date - a.date);
				} else {
					listFriendsOfUser = req.user.friends.sort((a, b) => a.date - b.date);
				}
				listFriendsOfUser = req.user.friends.map((f) => f.user._id);
				// query = [
				//     { _id: { $in: listFriendsOfUser }, $sort: { "friends.date": sort } },
				// ];
				query.push(
					{ $match: { _id: { $in: listFriendsOfUser } } },
					{ $addFields: { ListUsers: { $indexOfArray: [listFriendsOfUser, '$_id'] } } },
					{ $sort: { ListUsers: 1 } },
					{
						$project: {
							ListUsers: 0,
							refreshToken: 0,
						},
					}
				);
			} else if (type === 'requests') {
				// get list request of user to list by oder by date
				let listRequestOfUser = [];
				if (sort == 'desc') {
					req.user.friendRequests.sort((a, b) => b.date - a.date);
				} else {
					req.user.friendRequests.sort((a, b) => a.date - b.date);
				}
				listRequestOfUser = req.user.friendRequests.map((r) => r.user._id);

				query.push(
					{ $match: { _id: { $in: listRequestOfUser } } },
					{ $addFields: { ListUsers: { $indexOfArray: [listRequestOfUser, '$_id'] } } },
					{ $sort: { ListUsers: 1 } },
					{
						$project: {
							ListUsers: 0,
							refreshToken: 0,
						},
					}
				);
			} else if (type === 'suggests') {
				query = await querySearchSuggestFriends(req, next);
			} else {
				return res.status(404).json('Không tìm thấy!!!');
			}

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
			if (req.query.gender) {
				query.push({
					$match: { 'gender.value': { $eq: req.query.gender } },
				});
			}

			User.aggregate(query)
				.skip(offset)
				.limit(limit)
				.exec((err, data) => {
					if (err) {
						console.log(err);
						return next(
							createError.InternalServerError(
								`${err.message} in method: ${req.method} of ${req.originalUrl}`
							)
						);
					}

					query.push({
						$count: 'totalCount',
					});

					User.aggregate(query).exec(async (err, result) => {
						if (err) {
							console.log(err);
							return next(
								createError.InternalServerError(
									`${err.message} in method: ${req.method} of ${req.originalUrl}`
								)
							);
						}

						let { totalCount } = result[0] ? result[0] : { totalCount: 0 };
						let listUsers = data;

						if (type === 'suggests' && totalCount == 0) {
							const userId = req.user._id;
							const user = await User.findById(userId);
							const listFriendsOfUser = user.friends.map((friend) => friend.user);
							const listFriendRequests = user.friendRequests.map((friend) => friend.user);
							const listSentRequests = user.sentRequests.map((friend) => friend.user);
							listFriendsOfUser.push(userId);

							const listHiddenUser = listFriendsOfUser.concat(
								listFriendRequests.concat(listSentRequests)
							);

							const query = [{ $match: { _id: { $nin: listHiddenUser } } }];
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
							listUsers = await new Promise((resolve, reject) => {
								User.aggregate(query).exec((err, data) => {
									if (err) {
										console.log(err);
										return reject(
											createError.InternalServerError(
												`${err.message} in method: ${req.method} of ${req.originalUrl}`
											)
										);
									}
									const userHobbies = user.hobbies ?? [];
									const usersHobbies = data.map((user) => user.hobbies ?? []);

									const similarityHobbies = usersHobbies.map((hobbies) => {
										const maxLength = Math.max(hobbies.length ?? 0, userHobbies.length ?? 0);
										if (maxLength == 0) return 0;
										const paddedUserHobbies = userHobbies.concat(
											Array(maxLength - userHobbies.length).fill('')
										);
										const paddedOrtherUsersHobbies = hobbies.concat(
											Array(maxLength - hobbies.length).fill('')
										);

										return calculateCosineSimilarity(paddedOrtherUsersHobbies, paddedUserHobbies);
									});
									const suggestUsers = data.map((user, index) => ({
										...user,
										similarity: similarityHobbies[index],
									}));
									suggestUsers.sort((a, b) => b.similarity - a.similarity);
									totalCount = data.length;
									data = suggestUsers.slice(offset, offset + limit);
									resolve(data);
								});
							});
						}

						User.populate(
							listUsers,
							[
								{ path: 'profilePicture', select: '_id link' },
								{ path: 'coverPicture', select: '_id link' },
							],
							(err, result) => {
								if (err) {
									console.log(err);
									return next(
										createError.InternalServerError(
											`${err.message} in method: ${req.method} of ${req.originalUrl}`
										)
									);
								}
								let users = result;
								const usersList = [];
								if (type === 'all') {
									users.forEach((user) => {
										const userObj = user;
										if (
											req.user.friends.some(
												(friend) =>
													friend.user && friend.user._id.toString() === user._id.toString()
											)
										) {
											userObj.relationship = 'friend';
										} else if (
											req.user.sentRequests.some(
												(sentRequest) =>
													sentRequest.user &&
													sentRequest.user._id.toString() === user._id.toString()
											)
										) {
											userObj.relationship = 'sent';
										} else if (
											req.user.friendRequests.some(
												(friendRequest) =>
													friendRequest.user &&
													friendRequest.user._id.toString() === user._id.toString()
											)
										) {
											userObj.relationship = 'received';
										} else {
											userObj.relationship = 'none';
										}
										usersList.push(userObj);
										usersList.forEach((user) => {
											delete user.password;
											delete user.refreshToken;
										});
									});
									users = usersList;
								}
								return getListUser(
									res,
									totalCount,
									users,
									Math.ceil(totalCount / limit),
									Math.floor(offset / limit),
									offset * 1
								);
							}
						);
					});
				});
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// add hobbies for user
	async addHobbies(req, res, next) {
		try {
			const { hobbies } = req.body;
			const user = await User.findByIdAndUpdate(
				req.user._id,
				{
					$set: { hobbies },
				},
				{ new: true }
			);
			return res.status(200).json(user);
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// search new friends by keyword
	async searchNewFriends(req, res, next) {
		try {
			// pagination
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			// create query to filter by keyword
			const query = [
				{ _id: { $ne: req.user._id } },
				{
					$or: [
						{ fullname: { $regex: req.query.key, $options: 'i' } },
						{ email: { $regex: req.query.key, $options: 'i' } },
						{ city: { $regex: req.query.key, $options: 'i' } },
						{ from: { $regex: req.query.key, $options: 'i' } },
					],
				},
			];

			if (req.query.gender) {
				query.push({ gender: { $eq: req.query.gender } });
			}
			if (req.query.age) {
				// convert age to date
				const age = parseInt(req.query.age);
				const date = new Date();
				date.setFullYear(date.getFullYear() - age);
				// create query to filter by birthdate > date
				query.push({ birthdate: { $lte: date } });
			}
			if (req.query.city) {
				query.push({ city: { $regex: req.query.city, $options: 'i' } });
			}

			if (req.query.from) {
				query.push({ from: { $regex: req.query.from, $options: 'i' } });
			}

			// filter search and return user list with relationship status (friend, sent request, received request)
			User.paginate(
				{ $and: query },
				{
					offset,
					limit,
					populate: [
						{ path: 'profilePicture', select: '_id link' },
						{ path: 'coverPicture', select: '_id link' },
					],
				}
			)
				.then((data) => {
					const users = data.docs;
					const usersList = [];
					users.forEach((user) => {
						const userObj = user.toObject();
						if (req.user.friends.includes(user._id)) {
							userObj.relationship = 'friend';
						} else if (req.user.sentRequests.includes(user._id)) {
							userObj.relationship = 'sent';
						} else if (req.user.friendRequests.includes(user._id)) {
							userObj.relationship = 'received';
						} else {
							userObj.relationship = 'none';
						}
						usersList.push(userObj);
					});
					// hide password and refresh token
					usersList.forEach((user) => {
						delete user.password;
						delete user.refreshToken;
					});
					return getListPost(res, data, usersList);
				})
				.catch((err) => {
					console.log(err);
					return next(
						createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`)
					);
				});
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// get list friend of user by id
	async getFriendsListById(req, res, next) {
		try {
			// pagination
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			const user = await populateUser(req.params.id);

			let listFriendsOfUser = [];
			if (req.query.sort == 'desc') {
				user.friends.sort((a, b) => b.date - a.date);
			} else {
				user.friends.sort((a, b) => a.date - b.date);
			}

			listFriendsOfUser = user.friends.map((friend) => friend.user._id);

			const query = [
				{ $match: { _id: { $in: listFriendsOfUser } } },
				{ $addFields: { ListUsers: { $indexOfArray: [listFriendsOfUser, '$_id'] } } },
				{ $sort: { ListUsers: 1 } },
				{
					$project: {
						ListUsers: 0,
						refreshToken: 0,
					},
				},
			];

			if (req.query.gender) {
				query.push({
					$match: { 'gender.value': { $eq: req.query.gender } },
				});
			}

			if (req.query.key) {
				query.push({
					$match: {
						$or: [
							{ fullname: { $regex: req.query.key, $options: 'i' } },
							{ email: { $regex: req.query.key, $options: 'i' } },
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
							createError.InternalServerError(
								`${err.message} in method: ${req.method} of ${req.originalUrl}`
							)
						);
					}
					query.push({
						$count: 'totalCount',
					});

					User.aggregate(query).exec((err, result) => {
						if (err) {
							console.log(err);
							return next(
								createError.InternalServerError(
									`${err.message} in method: ${req.method} of ${req.originalUrl}`
								)
							);
						}
						const { totalCount } = result[0] ? result[0] : { totalCount: 0 };

						User.populate(
							data,
							[
								{ path: 'profilePicture', select: '_id link' },
								{ path: 'coverPicture', select: '_id link' },
							],
							(err, data) => {
								if (err) {
									console.log(err);
									return next(
										createError.InternalServerError(
											`${err.message} in method: ${req.method} of ${req.originalUrl}`
										)
									);
								}
								let users = data;
								const usersList = [];
								users.forEach((user) => {
									const userObj = user;
									if (!req.user) {
										userObj.relationship = 'none';
									} else if (
										req.user.friends.some(
											(friend) => friend.user._id.toString() === user._id.toString()
										)
									) {
										userObj.relationship = 'friend';
									} else if (
										req.user.sentRequests.some(
											(sentRequest) => sentRequest.user._id.toString() === user._id.toString()
										)
									) {
										userObj.relationship = 'sent';
									} else if (
										req.user.friendRequests.some(
											(friendRequest) => friendRequest.user._id.toString() === user._id.toString()
										)
									) {
										userObj.relationship = 'received';
									} else {
										userObj.relationship = 'none';
									}

									usersList.push(userObj);
									usersList.forEach((u) => {
										delete u.password;
										delete u.refreshToken;
									});
								});
								users = usersList;
								return getListUser(
									res,
									totalCount,
									users,
									Math.ceil(totalCount / limit),
									Math.ceil(offset / limit),
									offset * 1
								);
							}
						);
					});
				});
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// get friends of user's friends
	async getFriendsOfFriends(req, res, next) {
		try {
			// pagination
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			const friendsOfUser = await Promise.all(req.user.followings.map((friendId) => User.findById(friendId)));
			const friendsOfFriends = [];
			friendsOfUser.forEach((friend) => {
				friendsOfFriends.push(...friend.followings);
			});
			const uniqueFriendsOfFriends = [...new Set(friendsOfFriends)];
			// remove user current and user's friends
			const friendsOfFriendsFilter = uniqueFriendsOfFriends.filter(
				(friendId) => friendId.toString() !== req.user._id.toString() && !req.user.followings.includes(friendId)
			);

			// console.log(friendsOfFriendsFilter);
			const query = [{ _id: { $in: friendsOfFriendsFilter } }];

			if (req.query.gender) {
				query.push({ gender: { $eq: req.query.gender } });
			}
			if (req.query.age) {
				// convert age to date
				const age = parseInt(req.query.age);
				const date = new Date();
				date.setFullYear(date.getFullYear() - age);
				// create query to filter by birthdate > date
				query.push({ birthdate: { $lte: date } });
			}
			if (req.query.city) {
				query.push({ city: { $regex: req.query.city, $options: 'i' } });
			}

			if (req.query.from) {
				query.push({ from: { $regex: req.query.from, $options: 'i' } });
			}

			User.paginate(
				{ $and: query },
				{
					offset,
					limit,
					populate: [
						{ path: 'profilePicture', select: '_id link' },
						{ path: 'coverPicture', select: '_id link' },
					],
				}
			)
				.then((data) => {
					getListData(res, data);
				})
				.catch((err) => {
					res.status(500).json({
						message: err.message || 'Some error occurred while retrieving friends of friends.',
					});
				});
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// search user by name
	async search(req, res, next) {
		try {
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			User.paginate(
				{ fullname: { $regex: new RegExp(req.query.key), $options: 'i' } },
				{
					offset,
					limit,
					populate: [
						{ path: 'profilePicture', select: '_id link' },
						{ path: 'coverPicture', select: '_id link' },
						{
							path: 'friends.user',
							select: '_id fullname profilePicture isOnline',
							populate: { path: 'profilePicture', select: '_id link' },
						},
						{
							path: 'friendRequests.user',
							select: '_id fullname profilePicture isOnline',
							populate: { path: 'profilePicture', select: '_id link' },
						},
						{
							path: 'sentRequests.user',
							select: '_id fullname profilePicture isOnline',
							populate: { path: 'profilePicture', select: '_id link' },
						},
						{ path: 'role', select: '_id name' },
					],
				}
			)
				.then((data) => {
					getListData(res, data);
				})
				.catch((err) => {
					res.status(500).send({
						message: err.message || 'Some error occurred while retrieving tutorials.',
					});
				});
		} catch (error) {
			console.log(error);
			return next(
				createError.InternalServerError(
					`${error.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// search user in admin
	async searchUser(req, res, next) {
		try {
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			const roleUserID = mongoose.Types.ObjectId('6389667eb7991bdd04987103');
			User.paginate(
				{
					fullname: { $regex: new RegExp(req.query.key), $options: 'i' },
					role: roleUserID,
				},
				{
					offset,
					limit,
					sort: {
						createdAt: -1,
					},
					populate: [
						{ path: 'profilePicture', select: '_id link' },
						{ path: 'coverPicture', select: '_id link' },
						{
							path: 'friends.user',
							select: '_id fullname profilePicture isOnline',
							populate: { path: 'profilePicture', select: '_id link' },
						},
						{
							path: 'friendRequests.user',
							select: '_id fullname profilePicture isOnline',
							populate: { path: 'profilePicture', select: '_id link' },
						},
						{
							path: 'sentRequests.user',
							select: '_id fullname profilePicture isOnline',
							populate: { path: 'profilePicture', select: '_id link' },
						},
						{ path: 'role', select: '_id name' },
					],
				}
			)
				.then((data) => {
					getListData(res, data);
				})
				.catch((err) => {
					res.status(500).send({
						message: err.message || 'Some error occurred while retrieving tutorials.',
					});
				});
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	async searchAdmin(req, res, next) {
		try {
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			const roleUserID = mongoose.Types.ObjectId('64586af0a2167d1f245fbeea');
			User.paginate(
				{
					fullname: { $regex: new RegExp(req.query.key), $options: 'i' },
					role: roleUserID,
				},
				{
					offset,
					limit,
					populate: [
						{ path: 'profilePicture', select: '_id link' },
						{ path: 'coverPicture', select: '_id link' },
						{
							path: 'friends.user',
							select: '_id fullname profilePicture isOnline',
							populate: { path: 'profilePicture', select: '_id link' },
						},
						{
							path: 'friendRequests.user',
							select: '_id fullname profilePicture isOnline',
							populate: { path: 'profilePicture', select: '_id link' },
						},
						{
							path: 'sentRequests.user',
							select: '_id fullname profilePicture isOnline',
							populate: { path: 'profilePicture', select: '_id link' },
						},
						{ path: 'role', select: '_id name' },
					],
				}
			)
				.then((data) => {
					getListData(res, data);
				})
				.catch((err) => {
					res.status(500).send({
						message: err.message || 'Some error occurred while retrieving tutorials.',
					});
				});
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// get all users
	async getAllUsers(req, res) {
		const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
		User.paginate({}, { offset, limit })
			.then((data) => {
				getListData(res, data);
			})
			.catch((err) => {
				res.status(500).send({
					message: err.message || 'Some error occurred while retrieving tutorials.',
				});
			});
	}

	// get information of user: education, work, contact,... with privacy setting of user
	async getUserInfo(req, res, next) {
		try {
			const user = await getUserWithPrivacy(req, res);
			if (!user) {
				return next(createError.NotFound('User not found'));
			}
			const userObj = user.toObject();
			if (!req.user) {
				userObj.relationship = 'none';
			} else {
				if (
					req.user.friends.some((friend) => friend.user && friend.user._id.toString() === user._id.toString())
				) {
					userObj.relationship = 'friend';
				} else if (
					req.user.sentRequests.some(
						(sentRequest) => sentRequest.user && sentRequest.user._id.toString() === user._id.toString()
					)
				) {
					userObj.relationship = 'sent';
				} else if (
					req.user.friendRequests.some(
						(friendRequest) =>
							friendRequest.user && friendRequest.user._id.toString() === user._id.toString()
					)
				) {
					userObj.relationship = 'received';
				} else if (req.user._id.toString() === user._id.toString()) {
					userObj.relationship = 'self';
				} else {
					userObj.relationship = 'none';
				}
			}

			return res.status(200).json(userObj);
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	async lock(req, res, next) {
		try {
			const user = await populateUser(req.params.id);
			if (!user) {
				return next(createError.NotFound('Tài khoản không toàn tại'));
			}
			if (user.isPermanentlyLocked === true) {
				return next(createError.BadRequest(`Tài khoản đã bị khóa cho đến ${user.lockTime}`));
			}
			// lock account
			user.isPermanentlyLocked = true;
			user.reasonLock = req.body.reasonLock;
			await user.save();
			return user;
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// lock account
	async lockAccount(req, res, next) {
		try {
			const user = await populateUser(req.params.id);
			if (!user) {
				return next(createError.NotFound('Tài khoản không toàn tại'));
			}
			if (user.isPermanentlyLocked === true) {
				return next(createError.BadRequest(`Tài khoản đã bị khóa cho đến ${user.lockTime}`));
			}
			// lock account
			user.isPermanentlyLocked = true;
			user.reasonLock = req.body.reasonLock;
			await user.save();

			return res.status(200).json(user);
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// Unlock account
	async unlockAccount(req, res, next) {
		try {
			const user = await populateUser(req.params.id);
			if (!user) {
				return next(createError.NotFound('User not found'));
			}
			if (user.isPermanentlyLocked === true || user.lockTime > Date.now()) {
				// update lockTime < now
				user.isPermanentlyLocked = false;
				user.lockTime = Date.now() - 5 * 60 * 60 * 1000;
				user.loginAttempts = 0;
				await user.save();
				return res.status(200).json(user);
			}
			return next(createError.BadRequest('Tài khoản chưa bị khóa'));
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// create account for admin
	async createAccountAdmin(req, res, next) {
		try {
			// create account for admin
			const user = new User({
				fullname: req.body.fullname,
				email: req.body.email,
			});
			user.role = mongoose.Types.ObjectId('63896676b7991bdd049870fe');
			// generate new password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(req.body.password, salt);
			user.password = hashedPassword;
			await user.save();
			const userSaved = await populateUser(user._id);
			return res.status(200).json(userSaved);
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// get total user access in today
	async getTotalUserAccess(req, res, next) {
		try {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const total = await User.countDocuments({ accessLastest: { $gte: today } });
			return res.status(200).json({ total });
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// statistics user by age
	async statisticsUserByAge(req, res, next) {
		try {
			// fillter by type of age (0: 0-18, 1: 18-30, 2: 30-50, 3: 50-100)
			const statistics = await User.aggregate([
				{
					$group: {
						_id: {
							$switch: {
								branches: [
									{
										case: {
											$lte: [
												{ $divide: [{ $subtract: [new Date(), '$birthday'] }, 31536000000] },
												18,
											],
										},
										then: 0,
									},
									{
										case: {
											$lte: [
												{ $divide: [{ $subtract: [new Date(), '$birthday'] }, 31536000000] },
												30,
											],
										},
										then: 1,
									},
									{
										case: {
											$lte: [
												{ $divide: [{ $subtract: [new Date(), '$birthday'] }, 31536000000] },
												50,
											],
										},
										then: 2,
									},
									{
										case: {
											$lte: [
												{ $divide: [{ $subtract: [new Date(), '$birthday'] }, 31536000000] },
												100,
											],
										},
										then: 3,
									},
								],
								default: 4,
							},
						},
						total: { $sum: 1 },
					},
				},
			]);
			return statistics;
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// statistics user by gender
	async statisticsUserByGender(req, res, next) {
		try {
			const statistics = await User.aggregate([
				{
					$group: {
						_id: '$gender.value',
						label: { $first: '$gender.label' },
						total: { $sum: 1 },
					},
				},
			]);
			return statistics;
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// get user is online
	async getNumUserOnline(req, res, next) {
		try {
			const numUserOnline = await User.countDocuments({ isOnline: true });
			return numUserOnline;
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	async getTotalUser(req, res, next) {
		try {
			const totalUser = await User.countDocuments();
			return totalUser;
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// get user is created in today
	async getUserCreated(req, res, next) {
		try {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const UserCreatedInDay = await User.find({
				createdAt: { $gte: today },
				role: mongoose.Types.ObjectId('6389667eb7991bdd04987103'),
			})
				.populate({ path: 'profilePicture', select: '_id link' })
				.populate({ path: 'coverPicture', select: '_id link' })
				.populate({ path: 'friends.user', select: '_id fullname profilePicture isOnline' })
				.populate({ path: 'friendRequests.user', select: '_id fullname profilePicture isOnline' })
				.populate({ path: 'sentRequests.user', select: '_id fullname profilePicture isOnline' })
				.populate({ path: 'role', select: '_id name' });
			return UserCreatedInDay;
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	async getNumUserCreatedDaily(startDay, endDay) {
		try {
			// increase endDay 1
			endDay = moment(endDay).add(1, 'days').format('YYYY-MM-DD');
			const totalUserCreationsByDay = await User.aggregate([
				{
					$match: {
						createdAt: {
							$gte: new Date(startDay),
							$lte: new Date(endDay),
						},
					},
				},
				{
					$group: {
						_id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
						totalUserCreations: { $sum: 1 },
					},
				},
				{ $sort: { _id: 1 } },
			]);

			// Create an object to store the total user creations by day
			const totalUserCreationsMap = {};

			// Initialize the map with 0 for each day in the range
			let currentDate = new Date(startDay);
			const endDate = new Date(endDay);
			while (currentDate <= endDate - 1) {
				const dateString = currentDate.toISOString().split('T')[0];
				totalUserCreationsMap[dateString] = 0;

				const nextDate = currentDate.setDate(currentDate.getDate() + 1);
				currentDate = new Date(nextDate);
			}

			// Update the map with the actual total user creations
			totalUserCreationsByDay.forEach((result) => {
				totalUserCreationsMap[result._id] = result.totalUserCreations;
			});

			// Convert the map into an array of objects
			const totalUserCreationsByDayArray = Object.keys(totalUserCreationsMap).map((dateString) => ({
				day: dateString,
				totalUserCreations: totalUserCreationsMap[dateString],
			}));

			return totalUserCreationsByDayArray;
		} catch (err) {
			console.log(err);
		}
	}

	async getAllUserOnline(req, res, next) {
		try {
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			User.paginate(
				{
					fullname: { $regex: new RegExp(req.query.key), $options: 'i' },
					isOnline: true,
				},
				{
					offset,
					limit,
					populate: [
						{ path: 'profilePicture', select: '_id link' },
						{ path: 'coverPicture', select: '_id link' },
						{
							path: 'friends.user',
							select: '_id fullname profilePicture isOnline',
							populate: { path: 'profilePicture', select: '_id link' },
						},
						{
							path: 'friendRequests.user',
							select: '_id fullname profilePicture isOnline',
							populate: { path: 'profilePicture', select: '_id link' },
						},
						{
							path: 'sentRequests.user',
							select: '_id fullname profilePicture isOnline',
							populate: { path: 'profilePicture', select: '_id link' },
						},
						{ path: 'role', select: '_id name' },
					],
				}
			)
				.then((data) => {
					getListData(res, data);
				})
				.catch((err) =>
					responseError(res, 500, err.message ?? 'Some error occurred while retrieving tutorials.')
				);
		} catch (error) {
			console.log(error);
			return next(
				createError.InternalServerError(
					`${error.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}
}

module.exports = new UserController();
