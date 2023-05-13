const router = require("express").Router();
const FileController = require('../app/controllers/FileController');
const uploadFiles = require('../app/middlewares/UploadFilesMiddleware');
const AuthoMiddleware = require('../app/middlewares/AuthMiddleware');

router.post("/upload", AuthoMiddleware.isAuth, function (req, res, next) {
    uploadFiles(req, res, function (err) {
        if (err) {
            if (err.code === "LIMIT_UNEXPECTED_FILE") {
                return res.status(400).send({
                    message: "Chỉ cho phép tải lên tối đa 10 files.",
                });
            } else if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).send({
                    message: "Chỉ cho phép tải lên tối đa 10MB.",
                });
            }//error different format file
            else {
                return res.status(400).send({
                    message: err,
                });
            }
        }
        // Everything went fine.
        // res.status(200).send(req.files);
        FileController.uploadFiles(req, res, next);
    })
});

router.get("/:id", FileController.getFile);

router.delete("/:id", AuthoMiddleware.isAuth, FileController.delete);

module.exports = router;