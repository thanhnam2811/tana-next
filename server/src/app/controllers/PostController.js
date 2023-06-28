/* eslint-disable no-lonely-if */
/* eslint-disable no-else-return */
const createError = require('http-errors');
const Joi = require('joi');
const { getPagination } = require('../../utils/Pagination');
const Post = require('../models/Post');
const { User } = require('../models/User');
const Comment = require('../models/Comment');
const React = require('../models/React');
const File = require('../models/File');
const { getListPost, getListData } = require('../../utils/Response/listData');
const { getAllPostWithPrivacy, getPostWithPrivacy } = require('../../utils/Privacy/Post');
const {
	notificationForFriends,
	notificationForTags,
	notificationForSharedPost,
	notificationForReactPost,
} = require('../../utils/Notification/Post');

const {
	createActivityWithPost,
	createActivityWithSharedPost,
	createActivityWithReactPost,
} = require('../../utils/Activity/post');
const { validatePrivacy } = require('../models/Privacy');
const { responseError } = require('../../utils/Response/error');
const { checkBadWord } = require('../../utils/CheckContent/filter');

class PostController {
	// search post by content
	async search(req, res, next) {
		const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
		const { q } = req.query;
		try {
			Post.paginate(
				{ $text: { $search: q } },
				{
					populate: [
						{
							path: 'author',
							select: '_id fullname profilePicture isOnline friends',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
						{
							path: 'lastestFiveComments',
							populate: {
								path: 'author',
								select: '_id fullname profilePicture isOnline',
								populate: {
									path: 'profilePicture',
									select: '_id link',
								},
							},
						},
						{
							path: 'tags',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
						{
							path: 'privacy.includes',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
						{
							path: 'privacy.excludes',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
						{
							path: 'media',
							select: '_id link description',
						},
					],
				}
			)
				.then(async (data) => {
					const posts = data.docs;
					const listPosts = [];
					if (!req.user) {
						posts.forEach((post) => {
							const postObject = post.toObject();
							postObject.reactOfUser = 'none';
							listPosts.push(postObject);
						});
						// getListPost(res, data, listPosts);
						const listPostsFilter = await getAllPostWithPrivacy(listPosts, req);
						// pagination for listPosts
						const listPostsPaginate = listPostsFilter.slice(offset, offset + limit);
						res.status(200).send({
							totalItems: listPostsFilter.length,
							items: listPostsPaginate,
							totalPages: Math.ceil(listPosts.length / limit),
							currentPage: Math.floor(offset / limit),
							offset,
						});
					} else {
						Promise.all(
							posts.map(async (post) => {
								const postObject = post.toObject();
								postObject.reactOfUser = 'none';
								const react = await React.findOne({ post: post._id, user: req.user._id });
								if (react) {
									postObject.reactOfUser = react.type;
								}
								listPosts.push(postObject);
							})
						).then(async () => {
							// sort post by date desc
							listPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
							// getListPost(res, data, listPosts);
							const listPostsFilter = await getAllPostWithPrivacy(listPosts, req);
							// pagination for listPosts
							const listPostsPaginate = listPostsFilter.slice(offset, offset + limit);
							res.status(200).send({
								totalItems: listPostsFilter.length,
								items: listPostsPaginate,
								totalPages: Math.ceil(listPosts.length / limit),
								currentPage: Math.floor(offset / limit),
								offset,
							});
						});
					}
				})
				.catch((err) =>
					next(
						createError.InternalServerError(
							`${err.message}\nin method: ${req.method} of ${
								req.originalUrl
							}\nwith body: ${JSON.stringify(req.body, null, 2)}`
						)
					)
				);
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

	// [POST] create a post
	async add(req, res, next) {
		try {
			// validate request body
			const schema = Joi.object({
				content: Joi.string().required(),
				tags: Joi.array().items(Joi.string()),
				media: Joi.array().items(
					Joi.object({
						_id: Joi.string().required(),
						description: Joi.string(),
					}).unknown()
				),
				privacy: validatePrivacy,
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return next(createError.BadRequest(error.details[0].message));
			}

			// check content has bad-words
			const check = await checkBadWord(req.body.content);
			if (check) {
				return next(
					createError.BadRequest(
						'Vuii lòng kiểm tra nội dung bài viết, do có chưa ngôn từ vi phạm tiêu chuẩn cộng đồng'
					)
				);
			}

			const files = req.body.media?.map((file) => file._id);
			const newPost = new Post({
				...req.body,
				media: files,
			});
			newPost.author = req.user._id;
			const savedPost = await newPost.save();

			// update description of file
			if (req.body.media) {
				await Promise.all(
					req.body.media.map(async (file) => {
						const fileUpdated = await File.findByIdAndUpdate(
							file._id,
							{
								description: file.description,
								post: savedPost._id,
							},
							{ new: true }
						);
						return fileUpdated;
					})
				);
			}
			const post = await Post.findById(savedPost._id)
				.populate({
					path: 'author',
					select: '_id fullname profilePicture isOnline',
					populate: {
						path: 'profilePicture',
					},
				})
				.populate({
					path: 'tags',
					select: '_id fullname profilePicture isOnline',
					populate: {
						path: 'profilePicture',
					},
				})
				.populate({
					path: 'privacy.excludes',
					select: '_id fullname profilePicture isOnline',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				})
				.populate({
					path: 'privacy.includes',
					select: '_id fullname profilePicture isOnline',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				})
				.populate({
					path: 'media',
					select: '_id link description',
				});
			// create a notification for all tags of this post and all friends of the author
			await notificationForTags(savedPost, req.user);
			await notificationForFriends(savedPost, req.user);

			// save activity for user
			await createActivityWithPost(post, req.user);

			res.status(200).json(post);
		} catch (e) {
			console.error(e);
			return next(createError.InternalServerError(`${e.message} in method: ${req.method} of ${req.originalUrl}`));
		}
	}

	// [PUT] update a post
	async update(req, res, next) {
		try {
			// validate request body
			const schema = Joi.object({
				content: Joi.string(),
				tags: Joi.array().items(Joi.string()),
				media: Joi.array().items(
					Joi.object({
						_id: Joi.string().required(),
						description: Joi.string(),
					}).unknown()
				),
				privacy: Joi.object({
					value: Joi.string().valid('public', 'private', 'friends', 'includes', 'excludes').required(),
					// check if privacy is includes or excludes
					includes: Joi.when('value', {
						is: Joi.string().valid('includes'),
						then: Joi.array().items(Joi.string().required()).required(),
						otherwise: Joi.array().items(Joi.string()),
					}),
					excludes: Joi.when('value', {
						is: Joi.string().valid('excludes'),
						then: Joi.array().items(Joi.string().required()).required(),
						otherwise: Joi.array().items(Joi.string()),
					}),
				}),
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return next(createError.BadRequest(error.details[0].message));
			}
			const post = await Post.findById(req.params.id);
			if (post.author.toString() === req.user._id.toString()) {
				// update description of file
				await Promise.all(
					req.body.media.map(async (file) => {
						const fileUpdated = await File.findByIdAndUpdate(
							file._id,
							{
								description: file.description,
								post: post._id,
							},
							{ new: true }
						);
						return fileUpdated;
					})
				);

				const files = req.body.media.map((file) => file._id);
				const postUpdated = await Post.findByIdAndUpdate(
					req.params.id,
					{
						$set: {
							...req.body,
							media: files,
						},
					},
					{ new: true }
				)
					.populate({
						path: 'author',
						populate: {
							path: 'profilePicture',
						},
					})
					.populate({
						path: 'tags',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
						},
					})
					.populate({
						path: 'privacy.excludes',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					})
					.populate({
						path: 'privacy.includes',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					})
					.populate({
						path: 'media',
						select: '_id link description',
					});

				return res.status(200).send(postUpdated);
			} else {
				return responseError(res, 401, 'Bạn không có quyền cập nhật bài viết này');
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

	async deletePost(req, res, next) {
		try {
			const post = await Post.findById(req.params.id);
			if (post.author.toString() === req.user._id.toString() || req.user.role.name === 'ADMIN') {
				await post.delete();
				// delete all comments of this post
				await Comment.deleteMany({ post: req.params.id });
				// delete all reactions of this post
				await React.deleteMany({ post: req.params.id });
				// update the number of shares of the post
				const sharedPost = await Post.findById(post.sharedPost);
				if (sharedPost) {
					await Post.findByIdAndUpdate(post.sharedPost, { $inc: { shares: -1 } });
				}
				return post;
			} else {
				return responseError(res, 401, 'Bạn không có quyền xóa bài viết này');
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

	// [Delete] delete a post
	async delete(req, res, next) {
		try {
			const post = await Post.findById(req.params.id);
			if (post.author.toString() === req.user._id.toString() || req.user.role.name === 'ADMIN') {
				await post.delete();
				// delete all comments of this post
				await Comment.deleteMany({ post: req.params.id });
				// delete all reactions of this post
				await React.deleteMany({ post: req.params.id });
				// update the number of shares of the post
				const sharedPost = await Post.findById(post.sharedPost);
				if (sharedPost) {
					await Post.findByIdAndUpdate(post.sharedPost, { $inc: { shares: -1 } });
				}
				return res.status(200).json({
					message: 'Xóa bài viết thành công',
					Post: post,
				});
			} else {
				return responseError(res, 401, 'Bạn không có quyền xóa bài viết này');
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

	// [Get] get all posts of a user by id
	async getAll(req, res, next) {
		const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
		// get posts of a user by id and sort by date
		try {
			const user = await User.findById(req.params.id);
			if (!user) {
				return next(createError.NotFound('Không tìm thấy người dùng'));
			}
			Post.paginate(
				{ author: user._id },
				{
					sort: { createdAt: -1 },
					populate: [
						{
							path: 'author',
							select: '_id fullname profilePicture isOnline friends',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
						{
							path: 'lastestFiveComments',
							populate: {
								path: 'author',
								select: '_id fullname profilePicture isOnline',
								populate: {
									path: 'profilePicture',
									select: '_id link',
								},
							},
						},
						{
							path: 'tags',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
						{
							path: 'privacy.includes',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
						{
							path: 'privacy.excludes',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
						{
							path: 'media',
							select: '_id link description',
						},
					],
				}
			)
				.then(async (data) => {
					const posts = data.docs;
					const listPosts = [];
					if (!req.user) {
						posts.forEach((post) => {
							const postObject = post.toObject();
							postObject.reactOfUser = 'none';
							listPosts.push(postObject);
						});
						// getListPost(res, data, listPosts);
						const listPostsFilter = await getAllPostWithPrivacy(listPosts, req);
						// pagination for listPosts
						const listPostsPaginate = listPostsFilter.slice(offset, offset + limit);
						res.status(200).send({
							totalItems: listPostsFilter.length,
							items: listPostsPaginate,
							totalPages: Math.ceil(listPosts.length / limit),
							currentPage: Math.floor(offset / limit),
							offset,
						});
					} else {
						Promise.all(
							posts.map(async (post) => {
								const postObject = post.toObject();
								postObject.reactOfUser = 'none';
								const react = await React.findOne({ post: post._id, user: req.user._id });
								if (react) {
									postObject.reactOfUser = react.type;
								}
								listPosts.push(postObject);
							})
						).then(async () => {
							// sort post by date desc
							listPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
							// getListPost(res, data, listPosts);
							const listPostsFilter = await getAllPostWithPrivacy(listPosts, req);
							// pagination for listPosts
							const listPostsPaginate = listPostsFilter.slice(offset, offset + limit);
							res.status(200).send({
								totalItems: listPostsFilter.length,
								items: listPostsPaginate,
								totalPages: Math.ceil(listPosts.length / limit),
								currentPage: Math.floor(offset / limit),
								offset,
							});
						});
					}
				})
				.catch((err) =>
					next(
						createError.InternalServerError(
							`${err.message}\nin method: ${req.method} of ${
								req.originalUrl
							}\nwith body: ${JSON.stringify(req.body, null, 2)}`
						)
					)
				);
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

	async react(req, res, next) {
		try {
			const post = await Post.findById(req.params.id)
				.populate({
					path: 'author',
					select: '_id fullname profilePicture isOnline friends',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				})
				.populate({
					path: 'privacy.excludes',
					select: '_id fullname profilePicture isOnline',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				})
				.populate({
					path: 'privacy.includes',
					select: '_id fullname profilePicture isOnline',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				})
				.populate({
					path: 'media',
					select: '_id link description',
				});
			if (!post) {
				return next(createError.NotFound('Không tìm thấy bài viết'));
			}

			const checkPrivacy = await getPostWithPrivacy(post, req);
			if (!checkPrivacy) {
				return next(createError.Forbidden('Bạn không có quyền xem bài viết này'));
			}

			// check if the user has reacted this post before
			const listReactOfPost = await React.find({ post: req.params.id });
			const userReacted = listReactOfPost.find((react) => react.user.toString() === req.user._id.toString());
			if (userReacted && userReacted.type.toString() === req.body.type.toString()) {
				// if user has reacted, remove the reaction
				await React.findByIdAndDelete(userReacted._id);
				// update the number of reactions of the post
				await Post.findByIdAndUpdate(req.params.id, { $inc: { numberReact: -1 } });

				// populate post and add reactOfUser field to the post
				const postUpdated = await Post.findById(req.params.id)
					.populate({
						path: 'author',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
						},
					})
					.populate({
						path: 'lastestFiveComments',
						populate: {
							path: 'author',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
					})
					.populate({
						path: 'tags',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
						},
					})
					.populate({
						path: 'privacy.excludes',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					})
					.populate({
						path: 'privacy.includes',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					})
					.populate({
						path: 'media',
						select: '_id link description',
					});
				const postReturn = postUpdated.toObject();
				postReturn.reactOfUser = 'none';
				return res.status(200).json(postReturn);
			} else if (userReacted && userReacted.type.toString() !== req.body.type.toString()) {
				// if user has reacted but change the type of reaction
				userReacted.type = req.body.type;
				await userReacted.save();
				// populate post and add reactOfUser field to the post
				const postUpdated = await Post.findById(req.params.id)
					.populate({
						path: 'author',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
						},
					})
					.populate({
						path: 'lastestFiveComments',
						populate: {
							path: 'author',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
					})
					.populate({
						path: 'tags',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
						},
					})
					.populate({
						path: 'privacy.excludes',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					})
					.populate({
						path: 'privacy.includes',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					})
					.populate({
						path: 'media',
						select: '_id link description',
					});

				const postReturn = postUpdated.toObject();
				postReturn.reactOfUser = req.body.type;
				return res.status(200).json(postReturn);
			} else {
				// if user has not reacted, add a new reaction
				const newReact = new React({
					post: req.params.id,
					user: req.user._id,
					type: req.body.type,
				});
				await newReact.save();

				// update the number of reactions of the post
				await Post.findByIdAndUpdate(req.params.id, { $inc: { numberReact: 1 } });

				// create a notification for the author of the post
				if (post.author._id.toString() !== req.user._id.toString()) {
					await notificationForReactPost(post, req.user);

					const user = await User.findById(req.user._id);
					user.friends.forEach((friend, index, arr) => {
						if (friend.user._id.toString() === post.author._id.toString()) {
							arr[index].interactionScore += 1;
						}
					});
					user.save();
				}

				// save activity for user
				await createActivityWithReactPost(post, req.user);

				// populate post and add reactOfUser field to the post
				const postUpdated = await Post.findById(req.params.id)
					.populate({
						path: 'author',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
						},
					})
					.populate({
						path: 'lastestFiveComments',
						populate: {
							path: 'author',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
					})
					.populate({
						path: 'tags',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
						},
					})
					.populate({
						path: 'privacy.excludes',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					})
					.populate({
						path: 'privacy.includes',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					})
					.populate({
						path: 'media',
						select: '_id link description',
					});
				const postReturn = postUpdated.toObject();
				postReturn.reactOfUser = newReact.type;
				return res.status(200).send(postReturn);
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

	// share a post
	async share(req, res, next) {
		try {
			// validate request body
			const schema = Joi.object({
				content: Joi.string().required(),
				tags: Joi.array().items(Joi.string()),
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return next(createError.BadRequest(error.details[0].message));
			}
			const post = await Post.findById(req.params.id);
			const newPost = new Post({
				content: req.body.content,
				sharedPost: req.params.id,
				author: req.user._id,
			});
			const savedPost = await newPost.save();
			// update the number of shares of the post
			await Post.findByIdAndUpdate(req.params.id, { $inc: { numberShare: 1 } });
			// create a notification for the author of the post
			if (post.author.toString() !== req.user._id.toString()) {
				await notificationForSharedPost(savedPost, req.user);
			}

			// save activity for user
			await createActivityWithSharedPost(savedPost, req.user);

			res.status(200).send(savedPost);
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

	// get all reactions of a post
	async getAllReactions(req, res, next) {
		try {
			const listReact = await React.find({ post: req.params.id }).populate({
				path: 'user',
				select: '_id fullname profilePicture isOnline',
				populate: {
					path: 'profilePicture',
					select: '_id link',
				},
			});
			// classify reactions by type
			const listLike = listReact.filter((react) => react.type === 'like');
			const listLove = listReact.filter((react) => react.type === 'love');
			const listHaha = listReact.filter((react) => react.type === 'haha');
			const listWow = listReact.filter((react) => react.type === 'wow');
			const listSad = listReact.filter((react) => react.type === 'sad');
			const listAngry = listReact.filter((react) => react.type === 'angry');
			res.status(200).send({
				total: listReact,
				like: listLike,
				love: listLove,
				haha: listHaha,
				wow: listWow,
				sad: listSad,
				angry: listAngry,
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

	// [Get] get a post by id
	async get(req, res, next) {
		try {
			let post = await Post.findOneWithDeleted({
				_id: req.params.id,
			})
				.populate({
					path: 'lastestFiveComments',
					populate: {
						path: 'author',
						select: '_id fullname profilePicture isOnline friends',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					},
				})
				.populate({
					path: 'author',
					select: '_id fullname profilePicture isOnline friends',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				})
				.populate({
					path: 'tags',
					select: '_id fullname profilePicture isOnline',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				})
				.populate({
					path: 'privacy.includes',
					select: '_id fullname profilePicture isOnline',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				})
				.populate({
					path: 'privacy.excludes',
					select: '_id fullname profilePicture isOnline',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				})
				.populate({
					path: 'media',
					select: '_id link description',
				});

			if (req.user.role.name !== 'ADMIN' && req.user._id.toString() !== post.author._id.toString()) {
				post = await Post.findById(req.params.id)
					.populate({
						path: 'lastestFiveComments',
						populate: {
							path: 'author',
							select: '_id fullname profilePicture isOnline friends',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
					})
					.populate({
						path: 'author',
						select: '_id fullname profilePicture isOnline friends',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					})
					.populate({
						path: 'tags',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					})
					.populate({
						path: 'privacy.includes',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					})
					.populate({
						path: 'privacy.excludes',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					})
					.populate({
						path: 'media',
						select: '_id link description',
					});
			}

			if (!post) return next(createError.NotFound('Post not found'));

			let reactOfUser = 'none';

			if (req.user) {
				const postPrivacy = await getPostWithPrivacy(post, req);
				if (!postPrivacy) {
					return res.status(403).json('Bạn không có quyền xem bài viết này');
				}

				// get type of reaction of the user to the post
				const react = await React.findOne({ post: req.params.id, user: req.user._id });
				if (react) {
					reactOfUser = react.type;
				}
			} else {
				if (post.privacy.value != 'public') {
					return responseError(res, 401, 'Bạn không có quyền xem bài viết này');
				}
			}

			const postObject = post.toObject();
			postObject.reactOfUser = reactOfUser;
			//
			return res.status(200).json(postObject);
		} catch (err) {
			console.error(err);
			// if (err.kind.toString() == 'ObjectId')
			// 	return next(createError.NotFound(`Post not found with ${req.params.id}`));
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

	// [Get] get all posts of a user by id
	async getAllOfUser(req, res, next) {
		const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
		// get posts of a user by query id and sort by date
		try {
			Post.paginate(
				{ author: req.user._id },
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
						{
							path: 'lastestFiveComments',
							populate: {
								path: 'author',
								select: '_id fullname profilePicture isOnline',
								populate: {
									path: 'profilePicture',
									select: '_id link',
								},
							},
						},
						{
							path: 'tags',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
						{
							path: 'media',
							select: '_id link description',
						},
						{
							path: 'privacy.includes',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
						{
							path: 'privacy.excludes',
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
					// get type of reaction of the user to the post
					const posts = data.docs;
					const listPosts = [];
					Promise.all(
						posts.map(async (post) => {
							const postObject = post.toObject();
							postObject.reactOfUser = 'none';
							const react = await React.findOne({ post: post._id, user: req.user._id });
							if (react) {
								postObject.reactOfUser = react.type;
							}
							listPosts.push(postObject);
						})
					).then(() => {
						getListPost(res, data, listPosts);
					});
				})
				.catch((err) =>
					next(
						createError.InternalServerError(
							`${err.message}\nin method: ${req.method} of ${
								req.originalUrl
							}\nwith body: ${JSON.stringify(req.body, null, 2)}`
						)
					)
				);
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

	// [Get] get all posts of user's friends and user random posts
	async getPostInHome(req, res, next) {
		const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
		// get posts of a user by query id and sort by date
		try {
			const listFriendId = req.user.friends.map((friend) => friend.user._id);
			listFriendId.push(req.user._id);

			const listPost = await Post.find({ author: { $in: listFriendId } })
				.sort({ updatedAt: -1 })
				.populate({
					path: 'author',
					select: '_id fullname profilePicture isOnline friends',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				})
				.populate({
					path: 'lastestFiveComments',
					populate: {
						path: 'author',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					},
				})
				.populate({
					path: 'tags',
					select: '_id fullname profilePicture isOnline',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				})
				.populate({
					path: 'privacy.excludes',
					select: '_id fullname profilePicture isOnline',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				})
				.populate({
					path: 'privacy.includes',
					select: '_id fullname profilePicture isOnline',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				})
				.populate({
					path: 'media',
					select: '_id link description',
				});

			// :TODO: if listPost is empty, get random posts

			// get type of reaction of the user to the post
			const listPosts = [];
			await Promise.all(
				listPost.map(async (post) => {
					const postObject = post.toObject();
					postObject.reactOfUser = 'none';
					const react = await React.findOne({ post: post._id, user: req.user._id });
					if (react) {
						postObject.reactOfUser = react.type;
					}
					listPosts.push(postObject);
				})
			).then(async () => {
				const friendScores = {};
				req.user.friends.forEach((friend) => {
					friendScores[friend.user._id.toString()] = friend.interactionScore;
				});

				const sortedPosts = listPost.sort((a, b) => {
					const interactionScoreA = friendScores[a.author._id.toString()];
					const interactionScoreB = friendScores[b.author._id.toString()];

					if (interactionScoreA === interactionScoreB) {
						// Sắp xếp theo updatedAt nếu interactionScore bằng nhau
						return b.updatedAt - a.updatedAt;
					}

					// Sắp xếp giảm dần theo interactionScore
					return friendScores[b.author] - friendScores[a.author];
				});

				// sort post by date desc
				// listPosts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

				const listPostsFilter = await getAllPostWithPrivacy(sortedPosts, req);
				// pagination for listPosts
				const listPostsPaginate = listPostsFilter.slice(offset, offset + limit);
				return res.status(200).send({
					totalItems: listPostsFilter.length,
					items: listPostsPaginate,
					totalPages: Math.ceil(listPosts.length / limit),
					currentPage: Math.floor(offset / limit),
					offset,
				});
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

	// [Get] files media in posts of user
	async getFilesInPost(req, res, next) {
		try {
			const post = await Post.findById(req.params.id);
			if (!post) {
				return next(createError.NotFound('Bài viết không tồn tại'));
			}
			const files = post.media;
			res.status(200).json(files);
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

	// [GET] get all posts
	async getAllPosts(req, res, next) {
		const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
		const q = req.query.key ?? '';
		// get posts of a user by query id and sort by date
		try {
			// check role Admin
			if (req.user.role.name !== 'ADMIN') return next(createError.Forbidden('Bạn không có quyền truy cập'));
			let query = {};
			if (q) {
				query = { $text: { $search: q } };
			}
			Post.paginate(query, {
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
					{
						path: 'lastestFiveComments',
						populate: {
							path: 'author',
							select: '_id fullname profilePicture isOnline',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
					},
					{
						path: 'tags',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					},
					{
						path: 'media',
						select: '_id link description',
					},
					{
						path: 'privacy.includes',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					},
					{
						path: 'privacy.excludes',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					},
				],
			})
				.then((data) => {
					getListData(res, data);
				})
				.catch((err) =>
					next(
						createError.InternalServerError(
							`${err.message}\nin method: ${req.method} of ${
								req.originalUrl
							}\nwith body: ${JSON.stringify(req.body, null, 2)}`
						)
					)
				);
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
}

module.exports = new PostController();
