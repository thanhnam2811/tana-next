const createError = require('http-errors');
const fs = require('fs');
const cloudinaryV2 = require('cloudinary').v2;
const cloudinary = require('../../configs/cloudinary');
const File = require('../models/File');
const { responseError } = require('../../utils/Response/error');
const { getPagination } = require('../../utils/Pagination');
const { getListData } = require('../../utils/Response/listData');

class FileController {
	async uploadFiles(req, res, next) {
		try {
			const uploader = (path) => cloudinary.uploads(path, 'Files');
			if (req.files.length <= 0) {
				return responseError(res, 400, 'Bạn nên chọn ít nhất là 1 file để upload.');
			}

			const files = [];
			await Promise.all(
				req.files.map(async (file) => {
					const { path } = file;
					const newPath = await uploader(path);
					const newFile = new File({
						name: file.filename,
						originalname: file.originalname,
						type: file.mimetype,
						link: newPath.url,
						size: file.size, // bytes
						public_id: newPath.id,
						creator: req.user._id,
					});
					if (req.body.conversation) {
						newFile.conversation = req.body.conversation;
					} else if (req.body.post) {
						newFile.post = req.body.post;
					}
					await newFile.save();
					fs.unlinkSync(path);
					files.push(newFile);
				})
			);

			res.status(200).json({
				message: 'files uploaded thành công!!!',
				files,
			});
		} catch (err) {
			console.log(err);
			//
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	async getFile(req, res) {
		try {
			const file = await File.findById(req.params.id);
			if (req.query.width && req.query.height) {
				const linkResize = cloudinaryV2.url(file.public_id, {
					width: req.query.width,
					height: req.query.height,
					crop: 'scale',
				});
				if (linkResize) {
					file.link = linkResize;
				}
			}
			res.status(200).send(file);
		} catch (error) {
			console.error(error);
			return responseError(res, 404, 'Không tìm thấy file');
		}
	}

	async delete(req, res, next) {
		try {
			const file = await File.findById(req.params.id);
			if (file.creator.toString() === req.user._id.toString()) {
				console.log(file.public_id);
				if (file.public_id) {
					cloudinaryV2.uploader.destroy(file.public_id, async (err, result) => {
						if (err) {
							console.log(err);
							return responseError(res, 500, 'Xóa file thất bại!!!');
						}
						console.log(result);
						await file.delete();
						res.status(200).send({
							message: 'Xóa file thành công',
							File: file,
						});
					});
				} else {
					await file.delete();
					res.status(200).send({
						message: 'Xóa file thành công',
						File: file,
					});
				}
			} else {
				res.status(403).send('Bạn không có quyền xóa file này');
			}
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// get all file media of user post and ablum
	async getAllMedia(req, res, next) {
		try {
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			File.paginate(
				{
					creator: req.params.id,
					$or: [{ album: { $exists: true } }, { post: { $exists: true } }],
				},
				{
					limit,
					offset,
					sort: { createdAt: -1 },
					populate: [
						{
							path: 'creator',
							select: '_id fullname profilePicture isOnline',
							populate: { path: 'profilePicture', select: '_id link' },
						},
						{
							path: 'album',
							select: '_id name',
						},
						{
							path: 'post',
							select: '_id content author',
							populate: [
								{
									path: 'author',
									select: '_id fullname profilePicture isOnline',
									populate: { path: 'profilePicture', select: '_id link' },
								},
							],
						},
					],
				}
			)
				.then((data) => {
					getListData(res, data);
				})
				.catch((err) =>
					responseError(res, 500, err.message ?? 'Some error occurred while retrieving tutorials.')
				);
		} catch (error) {
			console.error(error);
			return next(error);
		}
	}
}

module.exports = new FileController();
