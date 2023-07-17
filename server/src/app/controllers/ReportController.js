const createError = require('http-errors');
const Joi = require('joi');
const Report = require('../models/Report');
const { User } = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Conversation = require('../models/Conversation');
const { getPagination } = require('../../utils/Pagination');
const { responseError } = require('../../utils/Response/error');
const { getListData } = require('../../utils/Response/listData');
const PostController = require('./PostController');
const CommentController = require('./CommentController');
const ConversationController = require('./ConversationController');
const UserController = require('./UserController');
const {
	notificationToAuthorOfComment,
	notificationToAuthorOfPost,
	notificationToUser,
	notificationToMembersOfConv,
	notificationToUserWithMessage,
} = require('../../utils/Notification/Admin');

class ReportController {
	async createReport(req, res, next) {
		try {
			//
			const schema = Joi.object({
				title: Joi.string().required(),
				description: Joi.string(),
				type: Joi.string().valid('user', 'post', 'comment', 'conversation', 'bug').required(),
				images: Joi.array().items(Joi.string()),
				user: Joi.string(),
				post: Joi.string(),
				comment: Joi.string(),
				conversation: Joi.string(),
			}).unknown();

			const { error } = schema.validate(req.body);
			if (error) {
				return responseError(res, 400, error.details[0].message);
			}
			// check object reported exist?
			if (req.body.type === 'user') {
				const user = await User.findById(req.body.user);
				if (!user) {
					return responseError(res, 404, 'User không tồn tại');
				}
			} else if (req.body.type === 'post') {
				const post = await Post.findById(req.body.post);
				if (!post) {
					return responseError(res, 404, 'Bài viết không tồn tại');
				}
			} else if (req.body.type === 'comment') {
				const comment = await Comment.findById(req.body.comment);
				if (!comment) {
					return responseError(res, 404, 'Bình luận không tồn tại');
				}
			} else if (req.body.type === 'conversation') {
				const conversation = await Conversation.findById(req.body.conversation);
				if (!conversation) {
					return responseError(res, 404, 'Cuộc trò chuyện không tồn tại');
				}
			}

			const newReport = new Report(req.body);
			newReport.reporter = req.user?._id;
			await newReport.save();

			return res.status(200).json(newReport);
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

	// reject report
	async rejectReport(req, res, next) {
		try {
			const report = await Report.findById(req.params.id);
			if (!report) {
				return next(createError.NotFound('Báo cáo không tồn tại'));
			}

			report.status = 'rejected';

			await report.save();
			res.json(report);
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

	// handle report
	async handleReport(req, res, next) {
		try {
			const report = await Report.findById(req.params.id)
				.populate({
					path: 'reporter',
					select: '_id fullname profilePicture isOnline',
					populate: { path: 'profilePicture', select: '_id link' },
				})
				.populate({
					path: 'user',
					select: '_id fullname profilePicture isOnline',
					populate: { path: 'profilePicture', select: '_id link' },
				})
				.populate({
					path: 'post',
					select: '_id content author',
					populate: { path: 'author', select: '_id fullname profilePicture isOnline' },
				})
				.populate({
					path: 'comment',
					select: '_id content author post',
					populate: [
						{
							path: 'author',
							select: '_id fullname profilePicture isOnline',
						},
						{
							path: 'post',
							select: '_id content author',
							populate: { path: 'author', select: '_id fullname profilePicture isOnline' },
						},
					],
				})
				.populate({
					path: 'conversation',
					select: '_id name members',
					populate: { path: 'members', select: '_id fullname profilePicture isOnline' },
				})
				.populate({
					path: 'images',
				});

			if (!report) {
				return next(createError.NotFound('Báo cáo không tồn tại'));
			}

			if (report.type) {
				if (report.type === 'post') {
					req.params.id = report.post._id;
					// delete post and notification to author
					await PostController.deletePost(req, res, next);
					await notificationToAuthorOfPost(report.post, req.user);
				} else if (report.type === 'comment') {
					req.params.id = report.comment._id;
					req.params.postId = report.comment.post._id;
					// delete comment and notification to author
					await CommentController.deleteComment(req, res, next);
					await notificationToAuthorOfComment(report.comment.post, report.comment, req.user);
				} else if (report.type === 'conversation') {
					req.params.id = report.conversation._id;
					// delete conversation and notification to members
					await ConversationController.deleteConversation(req, res, next);
					await notificationToMembersOfConv(report.conversation, req.user);
				} else if (report.type === 'user') {
					// delete user and notification to user
					req.params.id = report.user?._id;
					await UserController.lock(req, res, next);
					await notificationToUser(report.user, req.user);
				} else if (report.type === 'bug') {
					await notificationToUserWithMessage(
						report.reporter,
						req.user,
						'báo cáo của bạn đã được ghi nhận và sẽ khắc phục trong thời gian sớm nhất'
					);
				}
			}

			report.status = 'approved';
			await report.save();

			return res.status(200).json(report);
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

	// report user
	async reportUser(req, res, next) {
		try {
			const user = await User.findById(req.params.id);
			if (!user) {
				return next(createError.NotFound('User không tồn tại'));
			}
			const report = await Report.findOne({ user: req.params.id, reporter: req.user?._id });
			if (report) {
				return next(createError.BadRequest('Bạn đã báo cáo người dùng này'));
			}
			const newReport = new Report({
				user: req.params.id,
				reporter: req.user?._id,
				reason: req.body.reason,
			});
			await newReport.save();
			return res.status(200).json(newReport);
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

	// Report a comment
	async reportComment(req, res, next) {
		try {
			const comment = await Comment.findById(req.params.id);
			if (!comment) {
				return next(createError.NotFound('Bình luận không tồn tại'));
			}
			const report = await Report.findOne({ comment: comment._id, reporter: req.user?._id });
			if (report) {
				return next(createError.BadRequest('Bạn đã báo cáo bình luận này rồi'));
			}
			const newReport = new Report({
				comment: comment._id,
				reporter: req.user?._id,
				reason: req.body.reason,
			});
			await newReport.save();
			res.status(200).json(newReport);
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

	// Report post by id
	async reportPost(req, res, next) {
		try {
			const post = await Post.findById(req.params.id);
			if (!post) {
				return next(createError.NotFound('Bài viết không tồn tại'));
			}
			const report = await Report.findOne({ post: post._id, reporter: req.user?._id });
			if (report) {
				return next(createError.BadRequest('Bạn đã báo cáo bài viết này rồi'));
			}
			const newReport = new Report({
				post: post._id,
				reporter: req.user?._id,
				reason: req.body.reason,
			});
			await newReport.save();
			res.status(200).json(newReport);
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

	// Get report by id
	async getReportById(req, res, next) {
		try {
			const report = await Report.findById(req.params.id)
				.populate({
					path: 'reporter',
					select: '_id fullname profilePicture isOnline',
					populate: { path: 'profilePicture', select: '_id link' },
				})
				.populate({
					path: 'user',
					select: '_id fullname profilePicture isOnline',
					populate: { path: 'profilePicture', select: '_id link' },
				})
				.populate({
					path: 'post',
					select: '_id content',
					populate: { path: 'media', select: '_id link' },
				})
				.populate({
					path: 'comment',
					select: '_id content',
					populate: { path: 'media', select: '_id link' },
				})
				.populate('conversation')
				.populate('images');
			if (!report) {
				return next(createError.NotFound('Báo cáo không tồn tại'));
			}

			return res.status(200).json(report);
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

	// Get all reports order by quantity or created date
	async getAllReports(req, res, next) {
		try {
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			const { type, key } = req.query;
			let query = {};

			if (req.query.reporterId) {
				query = { reporter: req.query.reporterId };
			}

			if (type) {
				query = { type };

				if (req.query.id) {
					if (type === 'post') {
						query = { ...query, post: req.query.id };
					} else if (type === 'comment') {
						query = { ...query, comment: req.query.id };
					} else if (type === 'user') {
						query = { ...query, user: req.query.id };
					} else if (type === 'conversation') {
						query = { ...query, conversation: req.query.id };
					}
				}
			}

			if (key) {
				// search by title or description
				query = {
					...query,
					$or: [
						{ title: { $regex: new RegExp(key), $options: 'i' } },
						{ description: { $regex: new RegExp(key), $options: 'i' } },
					],
				};
			}

			Report.paginate(query, {
				offset,
				limit,
				sort: { createdAt: -1 },
				populate: [
					{
						path: 'reporter',
						select: '_id fullname profilePicture isOnline',
						populate: { path: 'profilePicture', select: '_id link' },
					},
					{
						path: 'user',
						select: '_id fullname profilePicture isOnline',
						populate: { path: 'profilePicture', select: '_id link' },
					},
					{
						path: 'post',
						select: '_id content author',
						populate: { path: 'media', select: '_id link' },
					},
					{
						path: 'comment',
						select: '_id content author',
						populate: { path: 'media', select: '_id link' },
					},
					{ path: 'conversation' },
					{
						path: 'images',
					},
				],
			})
				.then((data) => {
					getListData(res, data);
				})
				.catch((err) => {
					responseError(res, 500, err.message ?? 'Some error occurred while retrieving tutorials.');
				});
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
}

module.exports = new ReportController();
