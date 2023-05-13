const router = require("express").Router();
const ReportController = require("../app/controllers/ReportController");
const RoleMiddleware = require('../app/middlewares/RoleMiddleware');
const AuthoMiddleware = require('../app/middlewares/AuthMiddleware');
const isAuth = AuthoMiddleware.isAuth;


router.post("/user/:id", isAuth, ReportController.reportUser);
router.post("/post/:id", isAuth, ReportController.reportPost);
router.post("/comment/:id", isAuth, ReportController.reportComment);




module.exports = router;