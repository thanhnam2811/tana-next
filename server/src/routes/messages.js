const express = require('express');

const router = express.Router({ mergeParams: true });
const MessageController = require('../app/controllers/MessageController');
const AuthoMiddleware = require('../app/middlewares/AuthMiddleware');

const { isAuth } = AuthoMiddleware;
// add
router.post('/', isAuth, MessageController.add);
// chat with chatgpt
router.post('/chatbot', isAuth, MessageController.chatWithChatgpt);

// get
router.get('/', isAuth, MessageController.fetchMessages);
// router.get('/', MessageController.getAll);

// delete
router.delete('/:id', isAuth, MessageController.delete);

// update reader
router.put('/:id', isAuth, MessageController.update);

module.exports = router;
