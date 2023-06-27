const createError = require('http-errors');
const Notification = require('../models/Notification');
const { getPagination } = require('../../utils/Pagination');
const { responseError } = require('../../utils/Response/error');

class NotificationController {
	// get Notification by user ID
	async getNotifications(req, res, next) {
		try {
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			Notification.paginate(
				{ receiver: { $elemMatch: { $eq: req.user._id } } },
				{
					offset,
					limit,
					sort: { createdAt: -1 },
					populate: [
						{
							path: 'sender',
							select: '_id fullname profilePicture isOnline',
							populate: { path: 'profilePicture', select: '_id link' },
						},
						{
							path: 'receiver',
							select: '_id fullname profilePicture isOnline',
							populate: { path: 'profilePicture', select: '_id link' },
						},
						{
							path: 'readBy.readerId',
							select: '_id fullname profilePicture isOnline',
							populate: { path: 'profilePicture', select: '_id link' },
						},
					],
				}
			)
				.then(async (data) => {
					const listNotifications = [];
					data.docs.forEach((notification) => {
						const notificationObject = notification.toObject();
						notificationObject.isRead = notification.readBy.some(
							(reader) => reader.readerId._id.toString() === req.user._id.toString()
						);
						listNotifications.push(notificationObject);
					});

					const numberUnread = await Notification.countDocuments({
						receiver: {
							$elemMatch: {
								$eq: req.user._id,
							},
						},
						readBy: {
							$not: {
								$elemMatch: {
									readerId: req.user._id,
								},
							},
						},
					});

					res.status(200).send({
						totalItems: data.totalDocs,
						items: listNotifications,
						numberUnread,
						totalPages: data.totalPages,
						currentPage: data.page - 1,
						offset: data.offset,
					});
				})
				.catch((err) => {
					console.log(err);
					return next(
						createError.InternalServerError(
							`${err.message}\nin method: ${req.method} of ${
								req.originalUrl
							}\nwith body: ${JSON.stringify(req.body, null, 2)}`
						)
					);
				});
		} catch (err) {
			console.log(err);
			next(
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

	// get number of unread notifications
	async getUnreadNotifications(req, res, next) {
		try {
			const count = await Notification.countDocuments({
				receiver: {
					$elemMatch: {
						$eq: req.user._id,
					},
				},
				readBy: {
					$not: {
						$elemMatch: {
							readerId: req.user._id,
						},
					},
				},
			});
			return res.status(200).json({ count });
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

	async markAsRead(req, res, next) {
		try {
			const notification = await Notification.findById(req.params.id);
			if (!notification) {
				return responseError(res, 404, 'Thông báo không được tìm thấy');
			}
			if (
				!notification.receiver
					.map((receiver) => receiver._id.toString())
					.some((receiverId) => receiverId === req.user._id.toString())
			) {
				return responseError(res, 403, 'Bạn không phải là người nhận thông báo này');
			}
			if (
				notification.readBy
					.map((item) => item.readerId.toString())
					.some((readerId) => readerId === req.user._id.toString())
			) {
				return responseError(res, 403, 'Bạn đã đọc thông báo này rồi');
			}
			await notification.updateOne({
				$push: {
					readBy: {
						readerId: req.user._id,
					},
				},
			});
			return res.status(200).json('Đã đọc thông báo này');
		} catch (error) {
			console.log(error.message);
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

	async markAllAsRead(req, res, next) {
		try {
			// get all notification receivers include req.user._id
			const notifications = await Notification.find({
				receiver: {
					$elemMatch: {
						$eq: req.user._id,
					},
				},
			});
			if (notifications.length === 0) {
				return responseError(res, 404, 'Thông báo không được tìm thấy');
			}
			const notificationIds = notifications.map((notification) => notification._id);
			await Notification.updateMany(
				{
					_id: {
						$in: notificationIds,
					},
				},
				{
					$push: {
						readBy: {
							readerId: req.user._id,
						},
					},
				}
			);
			return res.status(200).json({ message: 'Đánh dấu đã đọc tất cả thông báo thành công' });
		} catch (error) {
			console.log(error.message);
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

	async removeNotification(req, res, next) {
		try {
			const notification = await Notification.findById(req.params.notificationId);
			if (!notification) {
				return responseError(res, 404, `Thông báo không được tìm thấy với id:${req.params.notificationId}`);
			}
			if (notification.receiver.some((mem) => mem.toString() === req.user._id.toString())) {
				const result = await Notification.findByIdAndUpdate(
					req.params.notificationId,
					{ $pull: { receiver: req.user._id } },
					{ new: true }
				);
				return res.status(200).send({
					notification: result,
				});
			}
			return responseError(res, 403, `Bạn không có quyền xóa thông báo với id:${req.params.notificationId}`);
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`)
			);
		}
	}
}

module.exports = new NotificationController();
