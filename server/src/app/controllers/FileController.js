const createError = require('http-errors');
const fs = require('fs');
const cloudinaryV2 = require('cloudinary').v2;
const cloudinary = require('../../configs/cloudinary');
const File = require('../models/File');

class FileController {
	async uploadFiles(req, res, next) {
		try {
			const uploader = (path) => cloudinary.uploads(path, 'Files');
			if (req.files.length <= 0) {
				return res.status(400).send({ message: 'Bạn nên chọn ít nhất là 1 file để upload.' });
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
				createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`)
			);
		}
	}

	async getFile(req, res) {
		try {
			const file = await File.findById(req.params.id);
			if (req.query.width && req.query.height) {
				file.link = cloudinaryV2.url(file.public_id, {
					width: req.query.width,
					height: req.query.height,
					crop: 'scale',
				});
			}
			res.status(200).send(file);
		} catch (error) {
			console.error(error);
			res.send('Không tìm thấy file');
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
							res.status(500).send('Xóa file thất bại');
						} else {
							console.log(result);
							await file.delete();
							res.status(200).send({
								message: 'Xóa file thành công',
								File: file,
							});
						}
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
				createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`)
			);
		}
	}
}

module.exports = new FileController();
