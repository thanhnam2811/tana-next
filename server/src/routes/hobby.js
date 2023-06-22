const router = require('express').Router();
const HobbyController = require('../app/controllers/HobbyController');
const AuthoMiddleware = require('../app/middlewares/AuthMiddleware');
const RoleMiddleware = require('../app/middlewares/RoleMiddleware');

const { isAuth } = AuthoMiddleware;

router.get('/', isAuth, HobbyController.getAllHobby);

router.post('/', isAuth, RoleMiddleware.IsAdmin, HobbyController.createNewHobby);

router.put('/:id', isAuth, RoleMiddleware.IsAdmin, HobbyController.updateHobby);

router.delete('/:id', isAuth, RoleMiddleware.IsAdmin, HobbyController.deleteHobby);

module.exports = router;
