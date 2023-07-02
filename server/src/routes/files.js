const router = require('express').Router();
const FileController = require('../app/controllers/FileController');
const uploadFiles = require('../app/middlewares/UploadFilesMiddleware');
const uploadFile = require('../app/middlewares/UploadFileMiddleware');
const AuthoMiddleware = require('../app/middlewares/AuthMiddleware');

router.post('/upload', AuthoMiddleware.isAuth, (req, res, next) => {
	uploadFiles(req, res, (err) => {
		if (err) {
			if (err.code === 'LIMIT_UNEXPECTED_FILE') {
				return res.status(400).send({
					message: 'Chỉ cho phép tải lên tối đa 10 files.',
				});
			}
			if (err.code === 'LIMIT_FILE_SIZE') {
				return res.status(400).send({
					message: 'Chỉ cho phép tải lên tối đa 10MB.',
				});
			} // error different format file

			return res.status(400).send({
				message: err,
			});
		}
		// Everything went fine.
		// res.status(200).send(req.files);
		FileController.uploadFiles(req, res, next);
	});
});

router.post('/', AuthoMiddleware.isAuth, uploadFile, FileController.uploadFile);

router.put('/:id', AuthoMiddleware.isAuth, FileController.updateFile);

router.get('/:id', FileController.getFile);

router.delete('/:id', AuthoMiddleware.isAuth, FileController.delete);

module.exports = router;
