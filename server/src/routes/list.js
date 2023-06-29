const router = require('express').Router();
const AuthoMiddleware = require('../app/middlewares/AuthMiddleware');
const RoleMiddleware = require('../app/middlewares/RoleMiddleware');
const ListController = require('../app/controllers/ListController');

const { isAuth } = AuthoMiddleware;

router.post('/', isAuth, RoleMiddleware.IsAdmin, ListController.createList);
router.put('/:id', isAuth, RoleMiddleware.IsAdmin, ListController.updateList);
router.delete('/:id', isAuth, RoleMiddleware.IsAdmin, ListController.deleteList);

router.get('/', isAuth, RoleMiddleware.IsAdmin, ListController.getLists);
router.get('/:id', isAuth, ListController.getList);

router.patch('/:id/items/add', isAuth, RoleMiddleware.IsAdmin, ListController.addDataToList);
router.patch('/:id/items/remove', isAuth, RoleMiddleware.IsAdmin, ListController.removeDataFromList);

module.exports = router;
