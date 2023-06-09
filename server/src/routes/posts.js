const express = require('express');

const router = express.Router();
const AuthoMiddleware = require('../app/middlewares/AuthMiddleware');
const PostController = require('../app/controllers/PostController');

// create a post
router.post('/', AuthoMiddleware.isAuth, PostController.add);
// share a post
router.post('/:id/share', AuthoMiddleware.isAuth, PostController.share);

// like / dislike a post
router.put('/:id/react', AuthoMiddleware.isAuth, PostController.react);
// update a post
router.put('/:id', AuthoMiddleware.isAuth, PostController.update);

// delete a post
router.delete('/:id', AuthoMiddleware.isAuth, PostController.delete);

router.get('/home', AuthoMiddleware.isAuth, PostController.getPostInHome);
// get user's all posts
router.get('/user/:id', AuthoMiddleware.getUserFromToken, PostController.getAll);
// get reactions of a post
router.get('/:id/reacts', PostController.getAllReactions);
// search
router.get('/search', AuthoMiddleware.isAuth, PostController.search);
// get a post
router.get('/:id', AuthoMiddleware.getUserFromToken, PostController.get);
// get all posts of current user
router.get('/', AuthoMiddleware.isAuth, PostController.getAllPosts);

module.exports = router;
