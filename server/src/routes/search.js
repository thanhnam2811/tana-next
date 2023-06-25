const router = require('express').Router();
const SearchController = require('../app/controllers/SearchController');
const AuthoMiddleware = require('../app/middlewares/AuthMiddleware');

const { isAuth } = AuthoMiddleware;

router.get('/', isAuth, SearchController.searchUserAndPost);

module.exports = router;
