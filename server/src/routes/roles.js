const router = require('express').Router();
const RoleController = require('../app/controllers/RoleController');
const AuthoMiddleware = require('../app/middlewares/AuthMiddleware');
const RoleMiddleware = require('../app/middlewares/RoleMiddleware');

//create a role
router.post('/', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, RoleController.create);
//update a role
router.put('/:id', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, RoleController.update);

module.exports = router;
