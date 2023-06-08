const util = require('util');
const multer = require('multer');
const slug = require('slug');

const diskStorage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, './storage/files');
	},
	filename: (req, file, callback) => {
		// convert file name to slug but keep the extension
		const fileName = `${Date.now()}-tana-${slug(file.originalname.replace(/\.[^/.]+$/, ''))}.${file.originalname
			.split('.')
			.pop()}`;
		callback(null, fileName);
	},
});

const filter = (req, file, callback) => {
	const math = [
		'image/png',
		'image/jpeg',
		'application/msword',
		'application/pdf',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'video/mp4',
		'video/x-matroska',
		'audio/mp3',
		'application/vnd.ms-powerpoint',
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'application/zip',
	];
	if (math.indexOf(file.mimetype) === -1) {
		const errorMess = `File <strong>${file.originalname}</strong> không hợp lệ. Chỉ cho phép tải cái file dạng: ppt, pptx, xls, xlsx, png, jpg, jpeg, mp3, mp4, mkv, doc, docx, pdf, zip.`;
		req.errorMess = errorMess;
		return callback(errorMess, false, new Error(errorMess));
	}
	return callback(null, true);
};

const uploadFiles = multer({
	storage: diskStorage,
	fileFilter: filter,
	limits: { fileSize: 1024 * 1024 * 10 }, // 10MB
}).array('files', 10);
const uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
