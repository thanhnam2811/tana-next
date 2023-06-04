const express = require('express');
const router = express.Router();
const AuthoMiddleware = require('../app/middlewares/AuthMiddleware');
const ConversationController = require('../app/controllers/ConversationController');

const isAuth = AuthoMiddleware.isAuth;
//new conv
router.post('/', isAuth, ConversationController.add);
router.get('/random', ConversationController.createRandomConversation);
router.get('/video-call', isAuth, ConversationController.createRoomIDVideoCall);

// router.put("/updateDB", ConversationController.updateMembersInDatabase);

//get conv of a user
router.get('/getAll', ConversationController.getAll);
router.get('/search', isAuth, ConversationController.search);
router.get('/', isAuth, ConversationController.getConversationOfUser);
router.get('/:id', isAuth, ConversationController.getConversationById);
//get conv includes two userId
router.get('/find/:userId', isAuth, ConversationController.getConversationByUserIds);
//get media of a conversation
router.get('/:id/files/:type', isAuth, ConversationController.getAllMedia);

//update conv
router.patch('/:id/members/:type', isAuth, ConversationController.updateMembers);
router.put('/:id/leave', isAuth, ConversationController.leaveConversation);
router.put('/:id', isAuth, ConversationController.update);
router.put('/user-deleted/:id', isAuth, ConversationController.userDeletedAllMessages);
//update member of conv

//delete conv
router.delete('/:id', isAuth, ConversationController.delete);

module.exports = router;
