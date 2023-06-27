const router = require('express').Router();
const UserController = require('../app/controllers/UserController');
const AuthoMiddleware = require('../app/middlewares/AuthMiddleware');
const PostController = require('../app/controllers/PostController');
const NotificationController = require('../app/controllers/NotificationController');
const RoleMiddleware = require('../app/middlewares/RoleMiddleware');
const ActivityController = require('../app/controllers/ActivityController');
const FileController = require('../app/controllers/FileController');

const { isAuth } = AuthoMiddleware;
const { getUserFromToken } = AuthoMiddleware;
// get user from token
router.get('/profile', isAuth, async (req, res) => {
	res.send(req.user);
});

// DELETE
router.delete('/:id', isAuth, RoleMiddleware.IsAdmin, UserController.delete);

// GET
router.get('/online', isAuth, RoleMiddleware.IsAdmin, UserController.getAllUserOnline);
router.get('/suggests', isAuth, UserController.suggestFriends);
router.get('/friends', isAuth, UserController.getFriendsList);
router.get('/notifications', isAuth, NotificationController.getNotifications);
router.get('/activities', isAuth, ActivityController.getAllActivityOfUser);
router.get('/searchUser/:type', isAuth, UserController.searchFriends);
router.get('/search', UserController.search);
router.get('/all', isAuth, RoleMiddleware.IsAdmin, UserController.getAllUsers);
router.get('/:id/friends', getUserFromToken, UserController.getFriendsListById);
router.get('/:id/posts', getUserFromToken, PostController.getAll);
router.get('/:id', getUserFromToken, UserController.getUserInfo);
router.get('/:id/media', isAuth, FileController.getAllMedia);
// router.get("/:id/info", getUserFromToken, UserController.getUserInfo);
router.get('/', UserController.getUser);
// router.get("/:id/information", getUserFromToken, UserController.getUserInformation);

// PUT
router.put('/hobbies', isAuth, UserController.addHobbies);
router.put('/remove-notification', isAuth, NotificationController.removeNotification);
router.put('/update-profile', isAuth, UserController.update);
router.put('/password', isAuth, UserController.updatePassword);
router.put('/set-password', isAuth, UserController.setPassword);
router.put('/:id/friend-request', isAuth, UserController.sendFriendRequest);
router.put('/:id/accept-friend', isAuth, UserController.acceptFriendRequest);
router.put('/:id/reject-request', isAuth, UserController.rejectFriendRequest);
router.put('/:id/unfriend', isAuth, UserController.unfriend);

// DELETE
router.delete('/activities/:id', isAuth, ActivityController.deleteActivity);

module.exports = router;
