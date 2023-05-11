const router = require('express').Router();
const AdminController = require('../app/controllers/AdminController');
const RoleMiddleware = require('../app/middlewares/RoleMiddleware');
const AuthoMiddleware = require('../app/middlewares/AuthMiddleware');
const ReportController = require('../app/controllers/ReportController');
const UserController = require('../app/controllers/UserController');

router.get('/dashboard', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, AdminController.getDashboard);
router.get('/statictisUser', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, AdminController.statictisUserPieChart);
router.get('/reports', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, ReportController.getAllReports);
router.get('/newUsers', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, AdminController.getListNewUser);
router.get('/usersAccess', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, AdminController.chartAccessUser);
router.get('/searchUser', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, AdminController.searchUser);
router.get('/searchAdmin', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, AdminController.searchAdmin);

router.post('/login', AdminController.login);
router.post('/createAccount', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, UserController.createAccountAdmin);

router.put('/unlockUser/:id', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, UserController.unlockAccount);
router.put('/lockUser/:id', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, UserController.lockAccount);
router.put('/changePW', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, AdminController.changePassword);

module.exports = router;
