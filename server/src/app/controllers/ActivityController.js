const createError = require('http-errors');
const { User } = require('../models/User');
const Activity = require('../models/Activity');
const { getPagination } = require('../../utils/Pagination');
const { getListData } = require('../../utils/Response/listData');
const { responseError } = require('../../utils/Response/error');

class ActivityController {
	async getAllActivityOfUser(req, res, next) {
		try {
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);

			Activity.paginate(
				{
					user: req.user?._id,
				},
				{
					offset,
					limit,
					sort: { createdAt: -1 },
					populate: [
						{
							path: 'user',
							select: '_id fullname profilePicture isOnline',
							populate: { path: 'profilePicture', select: '_id link' },
						},
						{
							path: 'friend',
							select: '_id fullname profilePicture isOnline',
							populate: { path: 'profilePicture', select: '_id link' },
						},
						{
							path: 'post',
							select: '_id content',
							populate: { path: 'media', select: '_id link' },
						},
						{
							path: 'comment',
							select: '_id content',
							populate: { path: 'media', select: '_id link' },
						},
						{
							path: 'reaction',
							select: '_id type',
							populate: { path: 'post', select: '_id content' },
						},
						{
							path: 'reaction',
							select: '_id type',
							populate: { path: 'comment', select: '_id content' },
						},
					],
				}
			)
				.then((data) => {
					getListData(res, data);
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

	async getAcitivityOfUserByUserId(req, res, next) {
		try {
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			const user = await User.findById(req.params.id);
			if (!user) {
				return next(createError.NotFound(`User not found`));
			}

			Activity.paginate(
				{
					user: user?._id,
				},
				{
					offset,
					limit,
					sort: { createdAt: -1 },
					populate: [
						{
							path: 'user',
							select: '_id fullname profilePicture isOnline',
							populate: { path: 'profilePicture', select: '_id link' },
						},
						{
							path: 'friend',
							select: '_id fullname profilePicture isOnline',
							populate: { path: 'profilePicture', select: '_id link' },
						},
						{
							path: 'post',
							select: '_id content',
							populate: { path: 'media', select: '_id link' },
						},
						{
							path: 'comment',
							select: '_id content',
							populate: { path: 'media', select: '_id link' },
						},
						{
							path: 'reaction',
							select: '_id type',
							populate: { path: 'post', select: '_id content' },
						},
						{
							path: 'reaction',
							select: '_id type',
							populate: { path: 'comment', select: '_id content' },
						},
					],
				}
			)
				.then((data) => {
					getListData(res, data);
				})
				.catch((err) => {
					responseError(res, 500, err.message ?? 'Some error occurred while retrieving tutorials.');
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

	async createActivityForUser(user, type, target, content, link) {
		try {
			await Activity.create({
				user,
				type,
				target,
				content,
				link,
			});
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	async deleteActivity(req, res, next) {
		try {
			const activity = await Activity.findById(req.params.id);
			if (!activity) {
				responseError(res, 404, `Activity không tìm thấy với id ${req.params.id}`);
			} else if (activity.user.toString() === req.user?._id.toString()) {
				const result = await Activity.findByIdAndDelete(req.params.id);
				res.status(200).json({
					activity: result,
				});
			} else {
				res.status(403).json({
					message: "You don't have permission to delete this activity!",
				});
				responseError(res, 403, 'Bạn không có quyền thực hiện hành động này!!');
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
}

module.exports = new ActivityController();
