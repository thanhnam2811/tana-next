const express = require('express');

const router = express.Router({ mergeParams: true });
const NotificationController = require('../app/controllers/NotificationController');
const AuthoMiddleware = require('../app/middlewares/AuthMiddleware');

const { isAuth } = AuthoMiddleware;

router.get('/', isAuth, NotificationController.getNotifications);
router.get('/unread', isAuth, NotificationController.getUnreadNotifications);

router.put('/read', isAuth, NotificationController.markAllAsRead);
router.put('/read/:id', isAuth, NotificationController.markAsRead);

router.delete('/:id', isAuth, NotificationController.removeNotification);

module.exports = router;
