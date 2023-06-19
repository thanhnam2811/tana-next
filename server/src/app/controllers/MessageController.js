const Joi = require('joi');
const createError = require('http-errors');
const crypto = require('crypto');
const Message = require('../models/Message');
const { getPagination } = require('../../utils/Pagination');
const Conversation = require('../models/Conversation');
const { getListData } = require('../../utils/Response/listData');
const { openai } = require('../../configs/chatgpt');
const SocketManager = require('../../socket/SocketManager');
const { eventName } = require('../../socket/constant');

const { responseError } = require('../../utils/Response/error');

// set encryption algorithm
const algorithm = 'aes-256-cbc';

// private key
const key = process.env.DECODE_KEY; // must be of 32 characters

class MessageController {
	// [Post] add a new message
	async add(req, res, next) {
		try {
			// Validate request body not empty
			const schema = Joi.object({
				text: Joi.string().min(0),
				media: Joi.array().items(Joi.string()),
			})
				.or('text', 'media')
				.unknown();

			const { error } = schema.validate(req.body);
			if (error) {
				return next(createError(400, error.details[0].message));
			}

			const conversation = await Conversation.findById(req.params.conversationId);
			if (conversation.members.some((mem) => mem.user.toString() === req.user._id.toString())) {
				// random 16 digit initialization vector
				const iv = crypto.randomBytes(16);

				// encrypt the string using encryption algorithm, private key and initialization vector
				const cipher = crypto.createCipheriv(algorithm, key, iv);
				let encryptedData = cipher.update(req.body.text, 'utf-8', 'hex');
				encryptedData += cipher.final('hex');

				// convert the initialization vector to base64 string
				const base64data = Buffer.from(iv).toString('base64');

				const newMessage = new Message(req.body);
				newMessage.iv = base64data;
				newMessage.text = encryptedData;
				newMessage.conversation = conversation._id;
				newMessage.sender = req.user._id;
				const savedMessage = await newMessage.save();
				// populate sender
				const message = await Message.findById(savedMessage._id)
					.populate({
						path: 'sender',
						select: '_id  fullname profilePicture',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					})
					.populate({
						path: 'media',
					});
				conversation.lastest_message = savedMessage._id;
				await conversation.save();
				message.text = req.body.text;

				const userIds = conversation.members
					.filter((member) => member.user.toString() !== message.sender._id.toString())
					.map((menber) => menber.user.toString());

				// send socket
				SocketManager.sendToList(userIds, eventName.SEND_MESSAGE, message);

				res.status(200).json(message);
			} else {
				next(createError(403, 'Bạn không có trong cuộc hội thoại này!!!'));
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

	// [PUT] update reader message
	async update(req, res, next) {
		try {
			const message = await Message.findById(req.params.id);
			if (!message.reader.includes(req.user._id)) message.reader.push(req.user._id);
			await message.save();
			res.status(200).json(message);
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

	// [Delete] delete a message
	async delete(req, res, next) {
		try {
			const message = await Message.findById(req.params.id);
			if (message.sender.toString() === req.user._id.toString()) {
				// await Message.delete({ _id: req.params.id });
				await message.delete();
				res.status(200).json(message);
			} else {
				return responseError(res, 401, 'Bạn không có quyền xóa tin nhắn này');
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

	// [Get] get all messages
	async getAll(req, res) {
		const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);

		Message.paginate({}, { offset, limit })
			.then((data) => {
				getListData(res, data);
			})
			.catch((err) => {
				return responseError(res, 500, err.message ?? 'Some error occurred while retrieving tutorials.');
			});
	}

	// [Get] fetch messages from conversationId
	async fetchMessages(req, res, next) {
		try {
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);

			const conversation = await Conversation.findById(req.params.conversationId);
			// if (!conversation) return res.status(404).send('Không tìm thấy cuộc hội thoại');

			// check user has existing user deleted conversation
			let index = -1;
			index = conversation.user_deleted.findIndex((item) => item.userId.toString() === req.user._id.toString());
			let deletedDate = new Date(-1); // date BC
			if (index !== -1) {
				deletedDate = conversation.user_deleted[index].deletedAt;
			}
			if (conversation.members.some((mem) => mem.user.toString() === req.user._id.toString())) {
				Message.paginate(
					{ conversation: req.params.conversationId, createdAt: { $gte: deletedDate } },
					{
						offset,
						limit,
						sort: { createdAt: -1 },
						populate: [
							{
								path: 'sender',
								select: '_id  fullname profilePicture',
								populate: {
									path: 'profilePicture',
									select: '_id link',
								},
							},
							{
								path: 'media',
							},
						],
					}
				)
					.then((data) => {
						data.docs.forEach((message) => {
							if (message.iv) {
								const iv = Buffer.from(message.iv, 'base64');
								const decipher = crypto.createDecipheriv(algorithm, key, iv);
								let decryptedData = decipher.update(message.text, 'hex', 'utf-8');
								decryptedData += decipher.final('utf-8');
								message.text = decryptedData;
							}
						});
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
				return responseError(res, 403, err.message ?? 'Bạn không có trong cuộc hội thoại này!!!');
			}
		} catch (error) {
			console.log(error);
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

	// Chat with Chatgpt
	async chatWithChatgpt(req, res, next) {
		try {
			// TODO: token fail updated
			const completion = await openai.createChatCompletion({
				model: 'gpt-3.5-turbo',
				messages: [{ role: 'user', content: `${req.body.text}` }],
			});
			res.status(200).json(completion.data.choices[0].message);
		} catch (error) {
			console.log(error);
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

module.exports = new MessageController();
