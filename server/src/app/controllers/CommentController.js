const createError = require('http-errors');
const Joi = require('joi');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const React = require('../models/React');
const { User } = require('../models/User');
const { getPagination } = require('../../utils/Pagination');
const {
	notificationCreateComment,
	notificationReplyComment,
	notificationReactComment,
	notificationTagComment,
} = require('../../utils/Notification/Comment');

const {
	createActivityWithComment,
	createActivityWithReplyComment,
	createActivityWithReactComment,
} = require('../../utils/Activity/comment');
const { getListPost } = require('../../utils/Response/listData');
const { responseError } = require('../../utils/Response/error');
const { checkBadWord } = require('../../utils/CheckContent/filter');

class CommentController {
	// [POST] create a comment
	async add(req, res, next) {
		try {
			// validate request body
			const schema = Joi.object({
				content: Joi.string().required(),
				tags: Joi.array().items(Joi.string()),
				media: Joi.array().items(Joi.string()),
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return next(createError(400, error.details[0].message));
			}

			// check content has bad word
			const check = await checkBadWord(req.body.content);
			if (check) {
				return next(
					createError.BadRequest(
						'Vuii lòng kiểm tra nội dung bình luận, do có chưa ngôn từ vi phạm tiêu chuẩn cộng đồng'
					)
				);
			}

			const newComment = new Comment(req.body);
			newComment.author = req.user._id;
			newComment.post = req.params.postId;
			const post = await Post.findById(req.params.postId);
			if (post) {
				const savedComment = await newComment.save();
				// add comment to lastétFiveComments of post
				post.lastestFiveComments.unshift(savedComment._id);
				if (post.lastestFiveComments.length > 5) {
					post.lastestFiveComments.pop();
				}
				// save post
				await post.save();

				// increase number of comments of post
				await Post.findByIdAndUpdate(req.params.postId, { $inc: { numberComment: 1 } });

				// create notification for author of post
				await notificationCreateComment(post, savedComment, req.user);
				await notificationTagComment(savedComment, req.user);

				if (savedComment.author.toString() !== req.user._id.toString()) {
					const user = await User.findById(req.user._id);
					user.friends.forEach((friend, index, arr) => {
						if (friend.user._id.toString() === savedComment.author.toString()) {
							arr[index].interactionScore += 2;
						}
					});
					user.save();
				}

				// save activity for user
				await createActivityWithComment(savedComment, req.user);

				// populate author, media
				const comment = await Comment.findById(savedComment._id)
					.populate({
						path: 'author',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					})
					.populate({
						path: 'media',
						select: '_id link',
					});
				return res.status(200).json(comment);
			}
			return responseError(res, 404, 'Bài viết không tồn tại');
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

	// [PUT] update a comment
	async update(req, res, next) {
		try {
			// validate request body
			const schema = Joi.object({
				content: Joi.string().required(),
				media: Joi.array().items(Joi.string()),
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return next(createError(400, error.details[0].message));
			}
			const comment = await Comment.findById(req.params.id);
			if (!comment) return next(createError(404, 'Bình luận không tồn tại'));
			if (comment.author.toString() === req.user._id.toString()) {
				const commentUpdated = await Comment.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
					.populate({
						path: 'author',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					})
					.populate({
						path: 'media',
						select: '_id link',
					});

				return res.status(200).json(commentUpdated);
			}
			return responseError(res, 401, 'Bạn không có quyền cập nhật bình luận này');
		} catch (error) {
			console.log(error);
			return next(
				createError.InternalServerError(`${error.message} in method: ${req.method} of ${req.originalUrl}`)
			);
		}
	}

	// [PUT] react a comment
	async react(req, res, next) {
		try {
			const comment = await Comment.findById(req.params.id);
			if (comment) {
				const reactOfUser = await React.findOne({ user: req.user._id, comment: req.params.id });
				// check if user has reacted to comment before
				if (reactOfUser && reactOfUser.type.toString() === req.body.type.toString()) {
					// delete react of user
					await React.findByIdAndDelete(reactOfUser._id);
					// decrease number of reacts of comment
					await Comment.findByIdAndUpdate(req.params.id, { $inc: { numberReact: -1 } });

					const commentUpdated = await Comment.findById(req.params.id)
						.populate({
							path: 'author',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						})
						.populate({
							path: 'media',
							select: '_id link',
						});

					const commentWithReactUser = commentUpdated.toObject();
					commentWithReactUser.reactOfUser = 'none';
					res.status(200).json(commentWithReactUser);
				} else if (reactOfUser && reactOfUser.type.toString() !== req.body.type.toString()) {
					// update react of user
					await React.findByIdAndUpdate(reactOfUser._id, { $set: { type: req.body.type } });

					const commentUpdated = await Comment.findById(req.params.id)
						.populate({
							path: 'author',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						})
						.populate({
							path: 'media',
							select: '_id link',
						});

					const commentWithReactUser = commentUpdated.toObject();
					commentWithReactUser.reactOfUser = req.body.type;
					res.status(200).json(commentWithReactUser);
				} else {
					// create new react of user
					const newReact = new React({ user: req.user._id, comment: req.params.id, type: req.body.type });
					await newReact.save();
					// increase number of reacts of comment
					await Comment.findByIdAndUpdate(req.params.id, { $inc: { numberReact: 1 } });

					// create notification for author of comment
					await notificationReactComment(comment, req.user);

					// save activity for user
					await createActivityWithReactComment(comment, req.user);
					if (comment.author.toString() !== req.user._id.toString()) {
						const user = await User.findById(req.user._id);
						user.friends.forEach((friend, index, arr) => {
							if (friend.user._id.toString() === comment.author.toString()) {
								arr[index].interactionScore += 2;
							}
						});
						user.save();
					}

					const commentUpdated = await Comment.findById(req.params.id)
						.populate({
							path: 'author',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						})
						.populate({
							path: 'media',
							select: '_id link',
						});

					const commentWithReactUser = commentUpdated.toObject();
					commentWithReactUser.reactOfUser = req.body.type;
					return res.status(200).json(commentWithReactUser);
				}
			} else {
				return responseError(res, 404, 'Bình luận không tồn tại');
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

	async deleteComment(req, res, next) {
		try {
			const comment = await Comment.findById(req.params.id).populate(
				'author',
				'_id fullname profilePicture isOnline'
			);
			const post = await Post.findById(req.params.postId);
			if (comment) {
				if (
					comment.author._id.toString() === req.user._id.toString() ||
					post.author.toString() === req.user._id.toString() ||
					req.user.role.name === 'ADMIN'
				) {
					await comment.delete();
					// check comment is included in lastestFiveComments of post
					const index = post.lastestFiveComments.indexOf(req.params.id);
					if (index > -1) {
						// update lastestFiveComments of post = top 5 comments lastest and not replyTo
						post.lastestFiveComments = await Comment.find({ post: req.params.postId, replyTo: null })
							.sort({ createdAt: -1 })
							.limit(5)
							.select('_id');
					}
					// delete all replies of comment and return number of replies deleted
					const numberReplyDeleted = await Comment.deleteMany({ replyTo: req.params.id });
					// decrease number of comments of post
					await Post.findByIdAndUpdate(req.params.postId, {
						$inc: { numberComment: -1 - numberReplyDeleted.deletedCount },
					});
					// save and return post populated with comments
					await post.save();
					return comment;
				}
				return responseError(res, 401, 'Bạn không có quyền xóa bình luận này');
			}
			return responseError(res, 404, 'Bình luận không tồn tại');
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

	// [Delete] delete a comment
	async delete(req, res, next) {
		try {
			const comment = await Comment.findById(req.params.id).populate(
				'author',
				'_id fullname profilePicture isOnline'
			);
			const post = await Post.findById(req.params.postId);
			if (comment) {
				if (
					comment.author._id.toString() === req.user._id.toString() ||
					post.author.toString() === req.user._id.toString() ||
					req.user.role.name === 'ADMIN'
				) {
					await comment.delete();
					// check comment is included in lastestFiveComments of post
					const index = post.lastestFiveComments.indexOf(req.params.id);
					if (index > -1) {
						// update lastestFiveComments of post = top 5 comments lastest and not replyTo
						post.lastestFiveComments = await Comment.find({ post: req.params.postId, replyTo: null })
							.sort({ createdAt: -1 })
							.limit(5)
							.select('_id');
					}
					// delete all replies of comment and return number of replies deleted
					const numberReplyDeleted = await Comment.deleteMany({ replyTo: req.params.id });
					// decrease number of comments of post
					await Post.findByIdAndUpdate(req.params.postId, {
						$inc: { numberComment: -1 - numberReplyDeleted.deletedCount },
					});
					// save and return post populated with comments
					await post.save();
					return res.status(200).json(comment);
				}
				return responseError(res, 401, 'Bạn không có quyền xóa bình luận này');
			}
			return responseError(res, 404, 'Bình luận không tồn tại');
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

	// [POST] add a reply to a comment
	async addReply(req, res, next) {
		try {
			const comment = await Comment.findById(req.params.id);
			if (comment) {
				// validate request body
				const schema = Joi.object({
					content: Joi.string().required(),
					media: Joi.array().items(Joi.string()),
				}).unknown();
				const { error } = schema.validate(req.body);
				if (error) {
					return next(createError(400, error.details[0].message));
				}
				const newComment = new Comment(req.body);
				newComment.author = req.user._id;
				newComment.post = req.params.postId;
				newComment.replyTo = req.params.id;
				const savedComment = await newComment.save();

				// create notification for author of comment
				await notificationReplyComment(comment, savedComment, req.user);
				await notificationTagComment(savedComment, req.user);

				// save activity for user
				await createActivityWithReplyComment(savedComment, req.user);
				if (savedComment.author.toString() !== req.user._id.toString()) {
					const user = await User.findById(req.user._id);
					user.friends.forEach((friend, index, arr) => {
						if (friend.user._id.toString() === savedComment.author.toString()) {
							arr[index].interactionScore += 2;
						}
					});
					user.save();
				}

				// increase number comment of post
				await Post.findByIdAndUpdate(req.params.postId, { $inc: { numberComment: 1 } });

				// increase number reply of comment
				await Comment.findByIdAndUpdate(req.params.id, { $inc: { numberReply: 1 } });

				// return comment populated with author and media
				const commentPopulated = await Comment.findById(savedComment._id)
					.populate({
						path: 'author',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					})
					.populate({
						path: 'media',
						select: '_id link',
					});
				return res.status(200).json(commentPopulated);
			}
			return responseError(res, 404, 'Bình luận không tồn tại');
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

	// [GET] get all replies of a comment
	async getAllReplies(req, res, next) {
		const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
		try {
			Comment.paginate(
				{ replyTo: req.params.id },
				{
					offset,
					limit,
					sort: { createdAt: 1 },
					populate: [
						{
							path: 'author',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
						{ path: 'media', select: '_id name link' },
					],
				}
			)
				.then((data) => {
					// get type of reaction of the user to the comment
					const comments = data.docs;
					const listComments = [];
					Promise.all(
						comments.map(async (comment) => {
							const commentObject = comment.toObject();
							commentObject.reactOfUser = 'none';
							if (req.user) {
								const react = await React.findOne({ comment: comment._id, user: req.user._id });
								if (react) {
									commentObject.reactOfUser = react.type;
								}
							}
							listComments.push(commentObject);
						})
					).then(() => {
						// sort post by date desc
						listComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
						getListPost(res, data, listComments);
					});
				})
				.catch((err) =>
					responseError(res, 500, err.message ?? 'Some error occurred while retrieving tutorials.')
				);
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

	// [GET] get all comments of a post (not include replies)
	async getAllOfPost(req, res, next) {
		const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
		try {
			Comment.paginate(
				{ post: req.params.postId, replyTo: null },
				{
					offset,
					limit,
					sort: { createdAt: -1 },
					populate: [
						{
							path: 'author',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
						{ path: 'media', select: '_id name link' },
					],
				}
			)
				.then((data) => {
					// get type of reaction of the user to the comment
					const comments = data.docs;
					const listComments = [];
					Promise.all(
						comments.map(async (comment) => {
							const commentObject = comment.toObject();
							commentObject.reactOfUser = 'none';
							if (req.user) {
								const react = await React.findOne({ comment: comment._id, user: req.user._id });
								if (react) {
									commentObject.reactOfUser = react.type;
								}
							}
							listComments.push(commentObject);
						})
					).then(() => {
						// sort post by date desc
						listComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
						getListPost(res, data, listComments);
					});
				})
				.catch((err) =>
					responseError(res, 500, err.message ?? 'Some error occurred while retrieving tutorials.')
				);
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

	// [GET] get a comment
	async get(req, res, next) {
		try {
			let comment = await Comment.findOneWithDeleted({ _id: req.params.id }).populate({
				path: 'author',
				select: '_id fullname profilePicture isOnline',
				populate: {
					path: 'profilePicture',
					select: '_id link',
				},
			});

			if (req.user.role.name !== 'ADMIN' && req.user._id.toString() !== comment.author._id.toString()) {
				comment = await Comment.findById(req.params.id).populate({
					path: 'author',
					select: '_id fullname profilePicture isOnline',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				});
			}

			if (!comment) {
				return responseError(res, 404, 'Comment not found');
			}

			let reactOfUser = 'none';
			if (req.user) {
				const react = await React.findOne({ comment: req.params.id, user: req.user._id });
				if (react) {
					reactOfUser = react.type;
				}
			}

			const commentObject = comment.toObject();
			commentObject.reactOfUser = reactOfUser;
			res.status(200).json(commentObject);
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
}

module.exports = new CommentController();
