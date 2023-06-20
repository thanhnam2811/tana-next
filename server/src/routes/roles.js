const router = require('express').Router();
const RoleController = require('../app/controllers/RoleController');
const AuthoMiddleware = require('../app/middlewares/AuthMiddleware');
const RoleMiddleware = require('../app/middlewares/RoleMiddleware');

// create a role
router.post('/', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, RoleController.create);
// update a role
router.put('/:id', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, RoleController.update);

// get all roles
router.get('/', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, RoleController.getAll);

// delete a role
router.delete('/:id', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, RoleController.delete);

module.exports = router;
