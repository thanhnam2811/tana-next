/* eslint-disable import/order */
/* eslint-disable no-else-return */
/* eslint-disable arrow-body-style */
const axios = require('axios');
const createError = require('http-errors');
const Joi = require('joi');
const console = require('console');
// const IP = require('ip');
const crypto = require('crypto');
const Conversation = require('../models/Conversation');
const { User } = require('../models/User');
const { getPagination } = require('../../utils/Pagination');
const Message = require('../models/Message');
const { populateConversation } = require('../../utils/Populate/Conversation');
const File = require('../models/File');
const mongoose = require('mongoose');
const { responseError } = require('../../utils/Response/error');

const { getListData } = require('../../utils/Response/listData');
const getLocationByIPAddress = require('../../configs/location');
// set encryption algorithm
const algorithm = 'aes-256-cbc';

// private key
const key = process.env.DECODE_KEY; // must be of 32 characters
const apiKey = process.env.API_KEY_VIDEOCALL;
class ConversationController {
	// search conversation
	async search(req, res, next) {
		const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
		const { q } = req.query;
		try {
			Conversation.paginate(
				{
					members: {
						$elemMatch: {
							user: req.user?._id,
						},
					},
					$or: [
						{
							$and: [
								{ name: { $exists: true } }, // Name field exists
								{ name: { $regex: q, $options: 'i' } }, // Name matches the search query
							],
						},
						{
							$and: [
								{ name: { $exists: false } }, // Name field does not exist
								{
									members: {
										$elemMatch: {
											nickname: { $regex: q, $options: 'i' }, // Nickname matches the search query
										},
									},
								},
							],
						},
					],
				},
				{
					offset,
					limit,
					sort: { updatedAt: -1 },
					populate: [
						{
							path: 'lastest_message',
							populate: {
								path: 'sender',
							},
						},
						{
							path: 'members.user',
							select: '_id fullname profilePicture isOnline isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
						{
							path: 'avatar',
						},
						{
							path: 'members.addedBy',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
						{
							path: 'members.changedNicknameBy',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
					],
				}
			)
				.then((data) => {
					data.docs.forEach((item) => {
						if (item.lastest_message && item.lastest_message.iv) {
							const iv = Buffer.from(item.lastest_message.iv, 'base64');
							const decipher = crypto.createDecipheriv(algorithm, key, iv);
							let decryptedData = decipher.update(item.lastest_message.text, 'hex', 'utf-8');
							decryptedData += decipher.final('utf-8');
							item.lastest_message.text = decryptedData;
						}
					});
					getListData(res, data);
				})
				.catch((err) => {
					return responseError(res, 500, err.message ?? 'Some error occurred while retrieving tutorials.');
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

	// TODO: Leave conversation
	async leaveConversation(req, res, next) {
		try {
			const conversation = await Conversation.findById(req.params.id);
			if (!conversation) {
				return responseError(res, 404, 'Không tìm thấy cuộc trò chuyện');
			}

			if (conversation.members.length === 2 || conversation.type === 'direct') {
				return responseError(res, 400, 'Không thể rời khỏi cuộc trò chuyện 2 người');
			}

			let index = -1;
			index = conversation.members.findIndex((item) => item.user.toString() === req.user?._id.toString());
			if (index !== -1) {
				const adminOfConversation = conversation.members.filter((member) => member.role === 'admin');
				conversation.members.splice(index, 1);
				if (
					adminOfConversation.length === 1 &&
					adminOfConversation[0].user.toString() === req.user?._id.toString()
				) {
					// set all members to admin
					conversation.members.forEach((member) => {
						member.role = 'admin';
					});
				}
				// create message system
				const messageSystem = await new Message({
					conversation: conversation._id,
					text: `<b>${req.user.fullname}</b> đã rời khỏi cuộc hội thoại này`,
					isSystem: true,
				}).save();

				// set lastest message
				conversation.lastest_message = messageSystem._id;
				await conversation.save();
				return res.status(200).send('Bạn đã rời khỏi cuộc trò chuyện này');
			} else {
				return responseError(res, 404, 'Bạn không có cuộc hội thoại này');
			}
		} catch (err) {
			console.error(err);
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

	// Delete all messages of conversation with user
	async userDeletedAllMessages(req, res, next) {
		try {
			const conversation = await Conversation.findById(req.params.id);
			if (conversation.members.some((member) => member.user.toString() === req.user?._id.toString())) {
				let index = -1;
				index = conversation.user_deleted.findIndex(
					(item) => item.userId.toString() === req.user?._id.toString()
				);
				if (index !== -1) {
					conversation.user_deleted[index].deletedAt = Date.now();
				} else {
					conversation.user_deleted.push({ userId: req.user?._id });
				}
				if (!conversation.hidden.includes(req.user?._id)) {
					conversation.hidden.push(req.user?._id);
				}
				await conversation.save();
				return res.status(200).send('Đã xóa cuộc hội thoại cho User');
			} else {
				return responseError(res, 404, 'Bạn không có cuộc hội thoại này');
			}
		} catch (err) {
			console.error(err);
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

	// [Post] add a new conversation
	async add(req, res, next) {
		// validate request
		const schema = Joi.object({
			members: Joi.array()
				.items(
					Joi.object({
						user: Joi.string().required(),
						nickname: Joi.string().min(3).max(100),
					})
				)
				.required(),
			name: Joi.string().when('members', {
				is: Joi.array().length(1),
				then: Joi.string().allow(null).default(null),
				otherwise: Joi.string().allow(null, '').default(''),
			}),
			avatar: Joi.string(),
		}).unknown();

		const { error } = schema.validate(req.body);
		if (error) {
			return next(createError.BadRequest(error.details[0].message));
		}

		// remove name if req.body.member.lenght = 1
		if (req.body.members.length === 1) {
			req.body.name = undefined;
		}

		try {
			if (req.body.members.length < 1) {
				return responseError(res, 400, 'Cuộc hội thoại phải có ít nhất 2 thành viên');
			}
			if (req.body.members.length == 1) {
				const conv = await Conversation.aggregate([
					{
						$match: {
							$and: [
								{
									members: {
										$elemMatch: { user: mongoose.Types.ObjectId(req.body.members[0].user) },
									},
								},
								{ members: { $elemMatch: { user: mongoose.Types.ObjectId(req.user?._id) } } },
								{
									members: {
										$size: 2,
									},
								},
								// check type = 'direct'
								{ type: 'direct' },
							],
						},
					},
				]);
				// Check conversation with 2 members. It's only 1
				if (!conv[0]) {
					await Promise.all(
						req.body.members.map(async (member) => {
							const user = await User.findById(member.user);
							if (!user)
								return next(
									createError.NotFound('Không tìm thấy người dùng để thêm vào cuộc hội thoại')
								);

							member.nickname = user.fullname;
							member.addedBy = req.user?._id;
							return member;
						})
					);
					req.body.type = 'direct';

					const newConversation = new Conversation(req.body);
					newConversation.members.push({
						user: req.user?._id,
						nickname: req.user.fullname,
						role: 'member',
						addedBy: req.user?._id,
					});
					newConversation.creator = req.user?._id;
					newConversation.history.push({
						editor: req.user?._id,
						content: `<b>${req.user.fullname}</b> đã tạo cuộc hội thoại`,
					});

					// save the conversation
					const savedConversation = await newConversation.save();

					// create message system
					const messageSystem = new Message({
						conversation: savedConversation._id,
						text: `<b>${req.user.fullname}</b> đã tạo cuộc hội thoại`,
						isSystem: true,
					});
					await messageSystem.save();

					newConversation.lastest_message = messageSystem;

					console.log(newConversation);

					return res.status(200).json(await populateConversation(savedConversation._id));
				} else {
					const conversation = await populateConversation(conv[0]._id);
					return res.status(200).json(conversation);
				}
			} else {
				await Promise.all(
					req.body.members.map(async (member) => {
						const user = await User.findById(member.user);
						if (!user)
							return next(createError.NotFound('Không tìm thấy người dùng để thêm vào cuộc hội thoại'));

						member.nickname = user.fullname;
						member.addedBy = req.user?._id;
						return member;
					})
				);

				if (!req.body.name) {
					req.body.name = req.body.members.map((x) => x.nickname).join(', ');
				}

				req.body.type = 'group';

				const newConversation = new Conversation(req.body);
				newConversation.members.push({
					user: req.user?._id,
					nickname: req.user.fullname,
					role: 'admin',
					addedBy: req.user?._id,
				});

				newConversation.history.push({
					editor: req.user?._id,
					content: `<b>${req.user.fullname}</b> đã tạo cuộc hội thoại`,
				});

				const savedConversation = await newConversation.save();

				// create message system
				const messageSystem = await new Message({
					conversation: savedConversation._id,
					text: `<b>${req.user.fullname}</b> đã tạo cuộc hội thoại`,
					isSystem: true,
				}).save();

				newConversation.lastest_message = messageSystem._id;

				await savedConversation.save();

				return res.status(200).json(await populateConversation(savedConversation._id));
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

	// [Get] get conv of a user
	async getConversationOfUser(req, res, next) {
		const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
		const q = req.query.key ?? '';

		try {
			Conversation.paginate(
				{
					members: {
						$elemMatch: {
							user: req.user?._id,
						},
					},
					hidden: {
						$nin: [req.user?._id],
					},
					$or: [
						{
							$and: [
								{ name: { $exists: true } }, // Name field exists
								{ name: { $regex: q, $options: 'i' } }, // Name matches the search query
							],
						},
						{
							$and: [
								{ name: { $exists: false } }, // Name field does not exist
								{
									members: {
										$elemMatch: {
											nickname: { $regex: q, $options: 'i' }, // Nickname matches the search query
										},
									},
								},
							],
						},
					],
				},
				{
					offset,
					limit,
					sort: { updatedAt: -1 },
					populate: [
						{
							path: 'lastest_message',
							populate: {
								path: 'sender',
							},
						},
						{
							path: 'members.user',
							select: '_id fullname profilePicture isOnline isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
						{
							path: 'avatar',
						},
						{
							path: 'members.addedBy',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
						{
							path: 'members.changedNicknameBy',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
					],
				}
			)
				.then((data) => {
					data.docs.forEach((item) => {
						if (item.lastest_message && item.lastest_message.iv) {
							const iv = Buffer.from(item.lastest_message.iv, 'base64');
							const decipher = crypto.createDecipheriv(algorithm, key, iv);
							let decryptedData = decipher.update(item.lastest_message.text, 'hex', 'utf-8');
							decryptedData += decipher.final('utf-8');
							item.lastest_message.text = decryptedData;
						}
					});
					getListData(res, data);
				})
				.catch((err) => {
					return responseError(res, 500, err.message ?? 'Some error occurred while retrieving tutorials.');
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

	// [Get] get all conversations
	async getAll(req, res) {
		const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);

		Conversation.paginate({}, { offset, limit, sort: { updatedAt: -1 } })
			.then((data) => {
				getListData(res, data);
			})
			.catch((err) => {
				return responseError(res, 500, err.message ?? 'Some error occurred while retrieving tutorials.');
			});
	}

	// get conversation by id
	async getConversationById(req, res) {
		try {
			const conversation = await populateConversation(req.params.id);
			if (conversation.members.some((member) => member.user?._id.toString() === req.user?._id.toString())) {
				return res.status(200).json(conversation);
			} else {
				return responseError(res, 401, 'Bạn không có trong conversation này');
			}
		} catch (err) {
			console.error(err);
			return responseError(res, 404, 'Không tìm thấy Conversation');
		}
	}

	// get conversation include 2 members by user id
	async getConversationByUserIds(req, res, next) {
		try {
			// check user with params id is exist
			const user = await User.findById(req.params.userId);
			if (!user) {
				return responseError(res, 404, 'Không tìm thấy User');
			}
			// const query = {
			// 	members: {
			// 		$elemMatch: {
			// 			user: req.user?._id,
			// 		},
			// 		$elemMatch: {
			// 			user: req.params.userId,
			// 		},
			// 	},
			// 	members: { $size: 2 },
			// };
			const query = {
				members: {
					$size: 2,
					$all: [{ $elemMatch: { user: req.user?._id } }, { $elemMatch: { user: req.params.userId } }],
				},
			};
			const conversation = await Conversation.findOne(query)
				.populate({
					path: 'lastest_message',
					populate: {
						path: 'sender',
					},
				})
				.populate({
					path: 'members.user',
					select: '_id fullname profilePicture isOnline isOnline',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				})
				.populate({
					path: 'avatar',
					select: '_id link',
				})
				.populate({
					path: 'members.addedBy',
					select: '_id fullname profilePicture isOnline',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				})
				.populate({
					path: 'members.changedNicknameBy',
					select: '_id fullname profilePicture isOnline',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				});
			if (conversation) {
				res.status(200).json(conversation);
			} else {
				// create new conversation with 2 members is req.user?._id and req.params.userId
				const newConversation = new Conversation({
					members: [
						{
							user: req.user?._id,
							role: 'admin',
							addedBy: req.user?._id,
							nickname: req.user.fullname,
						},
						{
							user: req.params.userId,
							role: 'member',
							addedBy: req.user?._id,
							nickname: user.fullname,
						},
					],
					creator: req.user?._id,
				});
				// name of conversation is name of 2 members
				const user1 = await User.findById(req.user?._id);
				const user2 = await User.findById(req.params.userId);
				newConversation.name = `${user1.fullname}, ${user2.fullname}`;
				// save the conversation
				const savedConversation = await newConversation.save();
				// create message system
				const messageSystem = new Message({
					conversation: savedConversation._id,
					text: `<b>${user1.fullname}</b> đã tạo cuộc hội thoại`,
					isSystem: true,
				});
				await messageSystem.save();

				// populate conversation
				const conversation = await populateConversation(savedConversation._id);

				res.status(200).json(conversation);
			}
		} catch (err) {
			console.error(err);
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

	// [PUT] update conversation
	async update(req, res, next) {
		try {
			// validate request
			const schema = Joi.object({
				name: Joi.string().min(3).max(255),
				avatar: Joi.string().min(3).max(255),
				user_deleted: Joi.string(),
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return responseError(res, 400, error.details[0].message);
			}

			const conversation = await Conversation.findById(req.params.id);
			if (conversation.members.some((member) => member.user.toString() === req.user?._id.toString())) {
				let contentMessage = '';

				for (const key of Object.keys(req.body)) {
					if (key === 'avatar') {
						contentMessage += 'đã đổi avatar cho cuộc hội thoại này';
						conversation[key] = req.body[key];
					} else if (key === 'name' && conversation.members.length > 2) {
						contentMessage += `đã đổi tên cuộc hội thoại này thành <b>${req.body[key]}</b>`;
						conversation[key] = req.body[key];
					} else if (key === 'name' && conversation.members.length == 2) {
						// change nickname of orther member
						const member = conversation.members.find(
							(member) => member.user.toString() !== req.user?._id.toString()
						);

						contentMessage += `đã đổi biệt danh của ${member.nickname} thành ${req.body[key]}`;

						member.nickname = req.body[key];
						member.changedNicknameBy = req.user?._id;
					}
				}

				// Check update
				if (contentMessage) {
					conversation.history.push({
						editor: req.user?._id,
						content: `<b>${req.user.fullname}</b> ${contentMessage}`,
					});

					// create message system
					const messageSystem = new Message({
						conversation: req.params.id,
						text: `<b>${req.user.fullname}</b> ${contentMessage}`,
						isSystem: true,
					});
					await messageSystem.save();

					// update lastest message
					conversation.lastest_message = messageSystem._id;
				}

				await conversation.save();

				// populate
				const savedConversation = await populateConversation(conversation._id);
				return res.status(200).json(savedConversation);
			} else {
				return responseError(res, 403, 'Bạn không nằm trong cuộc hội thoại này');
			}
		} catch (err) {
			console.error(err);
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

	// update members in conversation
	async updateMembers(req, res, next) {
		try {
			const conversation = await Conversation.findById(req.params.id);
			if (conversation.members.some((member) => member.user.toString() === req.user?._id.toString())) {
				const adminOfConversation = conversation.members
					.filter((member) => member.role === 'admin')
					.map((member) => member.user.toString());
				let contentMessage = '';
				// add members
				if (req.params.type === 'add') {
					// validate request
					const schema = Joi.object({
						newMembers: Joi.array()
							.items(
								Joi.object({
									user: Joi.string().required(),
									nickname: Joi.string(),
								})
							)
							.required(),
					}).unknown();
					const { error } = schema.validate(req.body);
					if (error) {
						return responseError(res, 400, error.details[0].message);
					}
					// check member is exist in conversation
					const membersOfConversation = conversation.members.map((member) => member.user.toString());
					const membersFromRequest = req.body.newMembers.map((member) => member.user.toString());
					const sameMembers = membersOfConversation.filter((member) => membersFromRequest.includes(member));
					if (sameMembers.length > 0) {
						return responseError(res, 403, 'Thành viên đã tồn tại trong cuộc hội thoại');
					}
					// set addedBy for new members
					req.body.newMembers.forEach((member) => {
						member.addedBy = req.user?._id;
					});
					// check members.length =2 => create new conversation
					if (conversation.members.length == 2 && conversation.type == 'direct') {
						const newConversation = new Conversation({
							members: conversation.members.concat(req.body.newMembers),
							name: req.body.name,
							creator: req.user?._id,
							type: 'group',
						});

						// create message system
						const messageSystem = new Message({
							conversation: newConversation._id,
							text: `<b>${req.user.fullname}</b> đã tạo cuộc hội thoại này`,
							isSystem: true,
						});

						await messageSystem.save();

						newConversation.lastest_message = messageSystem._id;
						await newConversation.save();
						// populate
						const savedConversation = await populateConversation(newConversation._id);
						return res.status(200).json(savedConversation);
					}

					conversation.members = conversation.members.concat(req.body.newMembers);
					// get fullname of new member
					const user = await User.findById(req.body.newMembers[0].user);
					if (req.body.newMembers.length == 1) {
						contentMessage = `đã thêm <b>${user.fullname}</b> vào cuộc hội thoại này`;
					} else {
						contentMessage = `đã thêm <b>${user.fullname}</b> và <b>${
							req.body.newMembers.length - 1
						}</b> thành viên khác vào cuộc hội thoại này`;
					}
				} else if (req.params.type === 'remove') {
					// validate request
					const schema = Joi.object({
						userID: Joi.string().required(),
					}).unknown();
					const { error } = schema.validate(req.body);
					if (error) {
						return responseError(res, 400, error.details[0].message);
					}

					if (adminOfConversation.includes(req.user?._id.toString())) {
						if (conversation.members.length == 2 && conversation.type == 'direct') {
							return responseError(
								res,
								403,
								'Bạn không thể xóa thành viên trong cuộc trò chuyện giữa 2 người'
							);
						}
						// get nickname of user will be removed
						let nickname = conversation.members
							.filter((member) => member.user.toString() === req.body.userID.toString())
							.map((member) => member.nickname);
						if (!nickname) {
							// get fullname of user will be removed
							const user = await User.findById(req.body.userID).select('fullname');
							nickname = user.fullname;
						}
						contentMessage = `đã xóa ${nickname} khỏi cuộc hội thoại này`;
						conversation.members = conversation.members.filter(
							(member) => member.user.toString() !== req.body.userID.toString()
						);
					} else {
						return responseError(res, 403, 'Bạn không có quyền xóa thành viên');
					}
				} else if (req.params.type === 'changeRole') {
					// validate request
					const schema = Joi.object({
						userID: Joi.string().required(),
						role: Joi.string().valid('admin', 'member').required(),
					}).unknown();
					const { error } = schema.validate(req.body);
					if (error) {
						return responseError(res, 400, error.details[0].message);
					}

					if (conversation.members.length == 2 && conversation.type == 'direct') {
						return responseError(res, 400, 'Không thể thay đổi quyền trong cuộc trò chuyện giữa 2 người');
					}

					if (adminOfConversation.includes(req.user?._id.toString())) {
						// get nickname of user will be removed
						// const member = conversation.members.filter(member => member.user.toString() === req.body.userID.toString());
						const index = conversation.members.findIndex(
							(member) => member.user.toString() === req.body.userID.toString()
						);

						// user cannot update role for self
						if (req.body.userID.toString() === req.user?._id.toString()) {
							return responseError(res, 403, 'Bạn không thể thay đổi vai trò của chính mình');
						}

						let { nickname } = conversation.members[index];
						if (!nickname) {
							// get fullname of user will be removed
							const user = await User.findById(req.body.userID).select('fullname');
							nickname = user.fullname;
						}
						if (index > -1 && conversation.members[index].role !== req.body.role) {
							conversation.members[index].role = req.body.role;
							contentMessage = `đã thay đổi vai trò của <b>${nickname}</b> thành <b>${req.body.role}</b>`;
						}
					} else {
						return responseError(res, 403, 'Bạn không có quyền thay đổi vai trò thành viên');
					}
				} else if (req.params.type === 'changeNickname') {
					// validate request
					const schema = Joi.object({
						userID: Joi.string().required(),
						nickname: Joi.string().min(0).max(50),
					}).unknown();
					const { error } = schema.validate(req.body);
					if (error) {
						return responseError(res, 400, error.details[0].message);
					}
					// get nickname of user will be removed
					const index = conversation.members.findIndex(
						(member) => member.user.toString() === req.body.userID.toString()
					);
					const { nickname } = conversation.members[index];
					const user = await User.findById(req.body.userID).select('fullname');
					if (nickname && req.body.nickname == '') {
						// get fullname of user will be removed
						conversation.members[index].nickname = req.body.nickname;
						conversation.members[index].changedNicknameBy = req.user?._id;
						contentMessage = `đã gỡ biệt danh của <b>${user.fullname}</b>`;
					} else if (req.body.nickname != nickname) {
						contentMessage = `đã thay đổi biệt danh của <b>${user.fullname}</b> thành <b>${req.body.nickname}</b>`;
						conversation.members[index].nickname = req.body.nickname;
						conversation.members[index].changedNicknameBy = req.user?._id;
					}
				} else {
					return responseError(res, 404, 'Không tìm thấy phương thức');
				}

				if (contentMessage != '') {
					conversation.history.push({
						editor: req.user?._id,
						content: `<b>${req.user.fullname}</b> ${contentMessage}`,
					});

					// create message system
					const messageSystem = await new Message({
						conversation: req.params.id,
						text: `<b>${req.user.fullname}</b> ${contentMessage}`,
						isSystem: true,
					}).save();
					// update last message
					conversation.lastest_message = messageSystem._id;
				}

				await conversation.save();
				// populate
				const savedConversation = await populateConversation(conversation._id);
				res.status(200).json(savedConversation);
			} else {
				return responseError(res, 404, 'Bạn không năm trong cuộc hội thoại này');
			}
		} catch (err) {
			console.error(err);
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

	async deleteConversation(req, res, next) {
		try {
			const conversation = await Conversation.findById(req.params.id);
			if (!conversation) {
				return res.status(404).json('Không tìm thấy cuộc hội thoại');
			}
			const adminOfConversation = conversation.members
				.filter((member) => member.role === 'admin')
				.map((member) => member.user.toString());
			if (adminOfConversation.includes(req.user?._id.toString()) || req.user.role.name === 'ADMIN') {
				await conversation.delete();
				// delete all message in conversation
				await Message.deleteMany({ conversation: req.params.id });
				return conversation;
			} else {
				return responseError(res, 403, 'Bạn không có quyền xóa cuộc hội thoại này');
			}
		} catch (error) {
			console.error(error);
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

	// [Delete] delete conversation
	async delete(req, res, next) {
		try {
			const conversation = await Conversation.findById(req.params.id);
			if (!conversation) {
				return res.status(404).json('Không tìm thấy cuộc hội thoại');
			}
			const adminOfConversation = conversation.members
				.filter((member) => member.role === 'admin')
				.map((member) => member.user.toString());
			if (adminOfConversation.includes(req.user?._id.toString()) || req.user.role.name === 'ADMIN') {
				await conversation.delete();
				// delete all message in conversation
				await Message.deleteMany({ conversation: req.params.id });

				return res.status(200).json('Đã xóa cuộc hội thoại thành công');
			} else {
				return responseError(res, 403, 'Bạn không có quyền xóa cuộc hội thoại này');
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

	async getAllMedia(req, res, next) {
		try {
			const conversations = await Conversation.findById(req.params.id);
			if (!conversations) {
				return responseError(res, 404, 'Không tìm thấy cuộc hội thoại');
			}
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			const memberOfConversation = conversations.members.filter(
				(member) => member.user.toString() === req.user?._id.toString()
			);
			if (memberOfConversation.length > 0) {
				const query = [{ conversation: req.params.id }];
				const mimeTypeOfMedia = ['image/png', 'image/jpeg', 'video/mp4', 'video/x-matroska'];
				if (req.params.type === 'media') {
					query.push({ type: { $in: mimeTypeOfMedia } });
				} else if (req.params.type === 'other') {
					query.push({ type: { $nin: mimeTypeOfMedia } });
				} else {
					return responseError(res, 404, 'Không tìm thấy');
				}

				File.paginate(
					{ $and: query },
					{
						limit,
						offset,
						sort: { createdAt: -1 },
						populate: {
							path: 'creator',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
					}
				)
					.then((data) => {
						getListData(res, data);
					})
					.catch((err) => {
						return responseError(
							res,
							500,
							err.message ?? 'Some error occurred while retrieving tutorials.'
						);
					});
			} else {
				return responseError(res, 403, 'Bạn không nằmm trong cuộc hội thoại này');
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

	// [Post] Create random conversation fit profile, hometown or place of residence and user isOnline
	async createRandomConversation(req, res, next) {
		try {
			// check user online and
			// const query = [
			//     { _id: { $ne: req.user?._id } },
			//     {
			//         $or: [
			//         { "city": { $regex: req.query.key, $options: 'i' } },
			//         { "from": { $regex: req.query.key, $options: 'i' } },
			//         ]
			//     },
			//     { isOnline: true },
			// ];
			// User.aggregate(query).exec((err, data)=>{
			//     if (err) {
			//         console.log(err);
			//         return next(createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`));
			//     }

			//     User.populate(data, [
			//         { path: 'profilePicture', select: '_id link' },
			//         { path: 'coverPicture', select: '_id link' },
			//     ], (err, data) => {
			//         if (err) {
			//             console.log(err);
			//             return next(createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`));
			//         }

			//         const newConversation = new Conversation({
			//             members: [
			//                 {
			//                     user: req.user?._id,
			//                     role: "admin",
			//                     addedBy: req.user?._id,
			//                     nickname: req.user.fullname,
			//                 },
			//             ],
			//             creator: req.user?._id,
			//         });
			//         //name of conversation is name of 2 members
			//         const user1 = req.user;
			//         const user2 = data[0];

			//         newConversation.name = `${user1.fullname}, ${user2.fullname}`;
			//         //save the conversation
			//         const savedConversation = newConversation.save();

			//         //create message system
			//         const messageSystem = new Message({
			//             conversation: savedConversation._id,
			//             text: `<b>${req.user.fullname}</b> đã tạo cuộc hội thoại`,
			//             isSystem: true,
			//             });
			//         messageSystem.save();

			//     });

			// });
			// const ipAddress = IP.address();
			const data = await getLocationByIPAddress('192.168.2.250');
			return res.json(data);
		} catch (error) {
			console.log(error);
			return next(
				createError.InternalServerError(`${error.message} in method: ${req.method} of ${req.originalUrl}`)
			);
		}
	}

	// Video call
	async createRoomIDVideoCall(req, res, next) {
		try {
			const options = {
				method: 'POST',
				headers: {
					Authorization: apiKey,
					'Content-Type': 'application/json',
				},
				// body: JSON.stringify({ "region": "sg001", "customRoomId": "aaa-bbb-ccc", "webhook": "see example", "autoCloseConfig": "see example" }),
			};
			const url = `https://api.videosdk.live/v2/rooms`;
			const response = await axios(url, options);
			return res.json(response.data);
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
}

module.exports = new ConversationController();
