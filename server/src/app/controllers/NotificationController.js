const Notification = require('../models/Notification');
const { getPagination } = require('../../utils/Pagination');
const { getListData } = require('../../utils/Response/listData');
const createError = require('http-errors');


class NotificationController {
    //get Notification by user ID
    async getNotifications(req, res) {
        try {
            const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
            Notification.paginate({ receiver: { $elemMatch: { $eq: req.user._id } } },
                {
                    offset, limit, sort: { createdAt: -1 },
                    populate: [
                        {
                            path: 'sender', select: '_id fullname profilePicture isOnline',
                            populate: { path: 'profilePicture', select: '_id link' }
                        },
                        {
                            path: 'receiver', select: '_id fullname profilePicture isOnline',
                            populate: { path: 'profilePicture', select: '_id link' }
                        },
                        {
                            path: 'read_by', select: '_id fullname profilePicture isOnline',
                            populate: { path: 'profilePicture', select: '_id link' }
                        },
                    ]
                }).then((data) => {
                    getListData(res, data);
                }).catch((err) => {
                    console.log(err);
                    res.status(500).send({
                        message: err.message || "Some error occurred while retrieving notifications."
                    });
                });
        } catch (err) {
            console.log(err);
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notifications."
            });
        }
    }

    async removeNotification(req, res, next) {
        try {
            const notification = await Notification.findById(req.params.notificationId);
            if (!notification) {
                res.status(404).send({
                    message: "Notification not found with id " + req.params.notificationId
                });
            }
            else {
                if (notification.receiver.some(mem => mem.toString() === req.user._id.toString())) {
                    const result = await Notification.findByIdAndUpdate(req.params.notificationId, { $pull: { receiver: req.user._id } }, { new: true });
                    res.status(200).send({
                        notification: result
                    });
                }
                else {
                    res.status(403).send({
                        message: "You don't have permission to delete this notification!"
                    });
                }
            }
        } catch (err) {
            console.log(err);
            return next(createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`));
        }
    }
}

module.exports = new NotificationController();