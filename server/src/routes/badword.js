const router = require('express').Router();
const BadWordController = require('../app/controllers/BadWordController');
const AuthoMiddleware = require('../app/middlewares/AuthMiddleware');
const RoleMiddleware = require('../app/middlewares/RoleMiddleware');

const { isAuth } = AuthoMiddleware;

router.get('/', isAuth, RoleMiddleware.IsAdmin, BadWordController.getAllBadWords);

router.post('/', isAuth, RoleMiddleware.IsAdmin, BadWordController.createBadWords);

router.put('/:id', isAuth, RoleMiddleware.IsAdmin, BadWordController.updateBadWords);

router.delete('/:id', isAuth, RoleMiddleware.IsAdmin, BadWordController.deleteBadWords);

module.exports = router;
