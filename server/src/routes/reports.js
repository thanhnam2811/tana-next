const router = require('express').Router();
const ReportController = require('../app/controllers/ReportController');
const AuthoMiddleware = require('../app/middlewares/AuthMiddleware');
const RoleMiddleware = require('../app/middlewares/RoleMiddleware');

const { isAuth } = AuthoMiddleware;

router.get('/:id', isAuth, RoleMiddleware.IsAdmin, ReportController.getReportById);
router.get('/', isAuth, RoleMiddleware.IsAdmin, ReportController.getAllReports);

router.post('/', isAuth, ReportController.createReport);
module.exports = router;
