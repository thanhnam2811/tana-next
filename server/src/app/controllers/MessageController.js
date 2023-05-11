const Message = require('../models/Message');
const Joi = require('joi');
const { getPagination } = require('../../utils/Pagination');
const Conversation = require('../models/Conversation');
const createError = require('http-errors');
const { getListData } = require('../../utils/Response/listData');

class MessageController {
	// [Post] add a new message
	async add(req, res, next) {
		try {
			// Validate request body not empty
			const schema = Joi.object({
				text: Joi.string().min(0),
				media: Joi.array().items(Joi.string()),
			}).or('text', 'media');

			const { error } = schema.validate(req.body);
			if (error) {
				return next(createError(400, error.details[0].message));
			}

			const conversation = await Conversation.findById(req.params.conversationId);
			if (conversation.members.some((mem) => mem.user.toString() === req.user._id.toString())) {
				const newMessage = new Message(req.body);
				newMessage.conversation = conversation._id;
				newMessage.sender = req.user._id;
				const savedMessage = await newMessage.save();
				//populate sender
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
				res.status(200).json(message);
			} else {
				next(createError(403, 'Bạn không có trong cuộc hội thoại này!!!'));
			}
		} catch (err) {
			return next(
				createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`)
			);
		}
	}

	//[PUT] update reader message
	async update(req, res, next) {
		try {
			const message = await Message.findById(req.params.id);
			if (!message.reader.includes(req.user._id)) message.reader.push(req.user._id);
			await message.save();
			res.status(200).json(message);
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`)
			);
		}
	}

	//[Delete] delete a message
	async delete(req, res, next) {
		try {
			const message = await Message.findById(req.params.id);
			console.log(message.sender, req.user._id);
			if (message.sender.toString() === req.user._id.toString()) {
				// await Message.delete({ _id: req.params.id });
				await message.delete();
				res.status(200).json(message);
			} else {
				res.status(401).send('Bạn không có quyền xóa tin nhắn này');
			}
		} catch (err) {
			console.error(err);
			return next(
				createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`)
			);
		}
	}

	//[Get] get all messages
	async getAll(req, res, next) {
		const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);

		Message.paginate({}, { offset, limit })
			.then((data) => {
				getListData(res, data);
			})
			.catch((err) => {
				res.status(500).send({
					message: err.message || 'Some error occurred while retrieving tutorials.',
				});
			});
	}

	// [Get] fetch messages from conversationId
	async fetchMessages(req, res, next) {
		const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);

		const conversation = await Conversation.findById(req.params.conversationId);

		// check user has existing user deleted conversation
		var index = -1;
		index = conversation.user_deleted.findIndex((item) => item.userId.toString() === req.user._id.toString());
		var deletedDate = new Date(-1); // date BC
		if (index !== -1) {
			deletedDate = conversation.user_deleted[index].deletedAt;
		}
		if (conversation.members.some((mem) => mem.user.toString() === req.user._id.toString())) {
			Message.paginate(
				{
					conversation: req.params.conversationId,
					createdAt: { $gte: deletedDate },
				},
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
					getListData(res, data);
				})
				.catch((err) => {
					res.status(500).send({
						message: err.message || 'Some error occurred while retrieving tutorials.',
					});
				});
		} else {
			res.status(403).send('Bạn không có trong cuộc hội thoại này!!!');
		}
	}
}

module.exports = new MessageController();
