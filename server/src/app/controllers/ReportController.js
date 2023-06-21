const createError = require('http-errors');
const Report = require('../models/Report');
const { User } = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { getPagination } = require('../../utils/Pagination');

class ReportController {
	async addReport(req, res, next) {
		try {
			//
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
			const report = await Report.findOne({ user: req.params.id, reporter: req.user._id });
			if (report) {
				return next(createError.BadRequest('Bạn đã báo cáo người dùng này'));
			}
			const newReport = new Report({
				user: req.params.id,
				reporter: req.user._id,
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
			const report = await Report.findOne({ comment: comment._id, reporter: req.user._id });
			if (report) {
				return next(createError.BadRequest('Bạn đã báo cáo bình luận này rồi'));
			}
			const newReport = new Report({
				comment: comment._id,
				reporter: req.user._id,
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
			const report = await Report.findOne({ post: post._id, reporter: req.user._id });
			if (report) {
				return next(createError.BadRequest('Bạn đã báo cáo bài viết này rồi'));
			}
			const newReport = new Report({
				post: post._id,
				reporter: req.user._id,
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

	// Get all reports order by quantity or created date
	async getAllReports(req, res, next) {
		try {
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			// count total reports of user or post or comment
			const reports = await Report.aggregate([
				{
					$group: {
						_id: {
							$cond: [
								{ $gt: ['$user', null] },
								'$user',
								{
									$cond: [{ $gt: ['$post', null] }, '$post', '$comment'],
								},
							],
						},
						quantity: { $sum: 1 },
						reporter: { $push: '$reporter' },
						reason: { $push: '$reason' },
						user: { $first: '$user' },
						post: { $first: '$post' },
						comment: { $first: '$comment' },
						createdAt: { $first: '$createdAt' },
						updatedAt: { $first: '$updatedAt' },
					},
				},
				{
					$lookup: {
						from: 'users',
						localField: 'reporter',
						pipeline: [
							{
								$project: {
									_id: 1,
									fullname: 1,
									profilePicture: 1,
								},
							},
							{
								$lookup: {
									from: 'files',
									localField: 'profilePicture',
									pipeline: [
										{
											$project: {
												_id: 1,
												link: 1,
											},
										},
									],
									foreignField: '_id',
									as: 'profilePicture',
								},
							},
						],
						foreignField: '_id',
						as: 'reporter',
					},
				},
				{
					$lookup: {
						from: 'users',
						localField: 'user',
						pipeline: [
							{
								$project: {
									_id: 1,
									fullname: 1,
									profilePicture: 1,
								},
							},
							{
								$lookup: {
									from: 'files',
									localField: 'profilePicture',
									pipeline: [
										{
											$project: {
												_id: 1,
												link: 1,
											},
										},
									],
									foreignField: '_id',
									as: 'profilePicture',
								},
							},
						],
						foreignField: '_id',
						as: 'user',
					},
				},
				{
					$lookup: {
						from: 'posts',
						localField: 'post',
						pipeline: [
							{
								$project: {
									_id: 1,
									content: 1,
									media: 1,
									numberReact: 1,
									numberComment: 1,
									numberShare: 1,
									tags: 1,
									author: 1,
									privacy: 1,
								},
							},
							{
								$lookup: {
									from: 'users',
									localField: 'author',
									pipeline: [
										{
											$project: {
												_id: 1,
												fullname: 1,
												profilePicture: 1,
											},
										},
										{
											$lookup: {
												from: 'files',
												localField: 'profilePicture',
												pipeline: [
													{
														$project: {
															_id: 1,
															link: 1,
														},
													},
												],
												foreignField: '_id',
												as: 'profilePicture',
											},
										},
									],
									foreignField: '_id',
									as: 'author',
								},
							},
							{
								$lookup: {
									from: 'files',
									localField: 'media',
									pipeline: [
										{
											$project: {
												_id: 1,
												link: 1,
											},
										},
									],
									foreignField: '_id',
									as: 'media',
								},
							},
						],
						foreignField: '_id',
						as: 'post',
					},
				},
				{
					$lookup: {
						from: 'comments',
						localField: 'comment',
						foreignField: '_id',
						as: 'comment',
					},
				},
				// { $skip: offset },
				// { $limit: limit },
				{ $sort: { quantity: -1 } },
				{
					$facet: {
						totalItems: [{ $count: 'totalItems' }],
						items: [
							{
								$skip: offset,
							},
							{
								$limit: limit,
							},
							{
								$project: {
									_id: 1,
									quantity: 1,
									reason: 1,
									reporter: 1,
									createdAt: 1,
									updatedAt: 1,
									user: { $arrayElemAt: ['$user', 0] },
									post: { $arrayElemAt: ['$post', 0] },
									comment: { $arrayElemAt: ['$comment', 0] },
								},
							},
						],
					},
				},
			]);
			return res.status(200).json({
				totalItems: reports[0].totalItems[0].totalItems,
				items: reports[0].items,
				totalPages: Math.ceil(reports[0].totalItems[0].totalItems / limit),
				currentPage: reports[0].items.length > 0 ? Math.ceil(offset / limit) : 0,
				offset,
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
