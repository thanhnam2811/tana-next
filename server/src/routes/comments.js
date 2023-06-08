const express = require('express');

const router = express.Router({ mergeParams: true });
const AuthoMiddleware = require('../app/middlewares/AuthMiddleware');
const CommentController = require('../app/controllers/CommentController');

router.post('/:id/reply', AuthoMiddleware.isAuth, CommentController.addReply);
router.post('/', AuthoMiddleware.isAuth, CommentController.add);

// react comment
router.put('/:id/react', AuthoMiddleware.isAuth, CommentController.react);
router.put('/:id', AuthoMiddleware.isAuth, CommentController.update);

router.delete('/:id', AuthoMiddleware.isAuth, CommentController.delete);

router.get('/:id/replies', AuthoMiddleware.getUserFromToken, CommentController.getAllReplies);
router.get('/:id', CommentController.get);
router.get('/', AuthoMiddleware.getUserFromToken, CommentController.getAllOfPost);

module.exports = router;
