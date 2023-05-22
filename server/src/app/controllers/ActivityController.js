const Activity = require('./../models/Activity');
const createError = require('http-errors');

class ActivityController {
    async getAllActivityOfUser(req, res, next) {
        try {
            const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);

            Activity.paginate({}, {
                 offset, limit, sort: { createdAt: -1}, 
                    populate: [
                        {
                            path: 'user', select: '_id fullname profilePicture isOnline',
                            populate: { path: 'profilePicture', select: '_id link' }
                        },
                        {
                            path: 'friend', select: '_id fullname profilePicture isOnline',
                            populate: { path: 'profilePicture', select: '_id link' }
                        },
                        {
                            path: 'post', select: '_id content',
                            populate: { path: 'media', select: '_id link' }
                        },
                        {
                            path: 'comment', select: '_id content',
                            populate: { path: 'media', select: '_id link' }
                        },
                        {
                            path: 'reaction', select: '_id type',
                            populate: { path: 'post', select: '_id content' }
                        },
                        {
                            path: 'reaction', select: '_id type',
                            populate: { path: 'comment', select: '_id content' }
                        },
                    ]
             })
                .then((data) => {
                    getListData(res, data);
                })
                .catch((err) => {
                    res.status(500).json({
                        message:
                            err.message || "Some error occurred while retrieving tutorials.",
                    });
                });
        } catch (err) {
            console.log(err);
            return next(createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`));

        }
    }

    async createActivityForUser(user, type, target, content, link){
        try {
             await Activity.create(
                {
                    user: user,
                    type: type,
                    target: target,
                    content: content,
                    link: link
                }
            );

        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async deleteActivity(req, res, next){ 
        try {
            const activity = await Activity.findById(req.params.id);
            if (!activity) {
                res.status(404).json({
                    message: "Activity không tìm thấy với id " + req.params.id
                });
            }
            else {
                if (activity.user.toString() === req.user._id.toString()) {
                    const result = await Activity.findByIdAndDelete(req.params.id);
                    res.status(200).json({
                        activity: result
                    });
                }
                else {
                    res.status(403).json({
                        message: "You don't have permission to delete this activity!"
                    });
                }
            }
        } catch (err) {
            console.log(err);
            return next(createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`));
        }
    }
}

module.exports = new ActivityController();