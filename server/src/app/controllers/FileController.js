const createError = require('http-errors');
const fs = require('fs');
const cloudinaryV2 = require('cloudinary').v2;
const Joi = require('joi');
const cloudinary = require('../../configs/cloudinary');
const File = require('../models/File');
const Album = require('../models/Album');
const { responseError } = require('../../utils/Response/error');
const { getPagination } = require('../../utils/Pagination');
const { getListData } = require('../../utils/Response/listData');
const { getPostWithPrivacy } = require('../../utils/Privacy/Post');

class FileController {
	async uploadFiles(req, res, next) {
		try {
			console.log(req.files);
			if (req.files.length <= 0) {
				return responseError(res, 400, 'Bạn nên chọn ít nhất là 1 file để upload.');
			}

			const uploader = (path) => cloudinary.uploads(path, 'Files');
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
						creator: req.user?._id,
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

	async uploadFile(req, res, next) {
		try {
			if (!req.file) return responseError(res, 400, 'Vui lòng chọn file cần upload');

			const uploader = (path) => cloudinary.uploads(path, 'Files');
			const { path } = req.file;
			const newPath = await uploader(path);
			const newFile = new File({
				name: req.file.filename,
				originalname: req.file.originalname,
				type: req.file.mimetype,
				link: newPath.url,
				size: req.file.size, // bytes
				public_id: newPath.id,
				creator: req.user?._id,
				...req.body,
			});
			await newFile.save();
			fs.unlinkSync(path);

			// increse size of album 1
			if (req.body.album)
				await Album.findByIdAndUpdate(req.body.album, {
					cover: newFile._id,
					$inc: { size: 1 },
				});
			return res.status(200).json(newFile);
		} catch (error) {
			console.log(error);
			return responseError(res, 500, error.message ?? 'Some error occurred while retrieving tutorials.');
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
			if (!file) {
				return responseError(res, 404, 'Không tìm thấy file');
			}

			if (file.creator.toString() === req.user?._id.toString()) {
				// decrese size of album 1
				if (file.album) {
					const album = await Album.findById(file.album);
					if (album.cover.toString() === file._id.toString()) {
						// sort createdAt -1
						const files = await File.find({ album: file.album }).sort({ createdAt: -1 });

						if (files.length > 1) {
							album.cover = files[1]._id;
						} else if (files.length == 1) {
							album.cover = null;
						}

						album.size -= 1;
						await album.save();
					}
				}

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

	async updateFile(req, res, next) {
		try {
			const file = await File.findById(req.params.id);
			if (file.creator.toString() !== req.user?._id.toString())
				return responseError(res, 403, 'Bạn không có quyền chỉnh sửa file này');

			// validate request body
			const schema = Joi.object({
				description: Joi.string().allow(''),
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return next(createError(400, error.details[0].message));
			}
			const { description } = req.body;
			const fileUpdated = await File.findByIdAndUpdate(
				req.params.id,
				{
					description,
				},
				{ new: true }
			);
			return res.status(200).json(fileUpdated);
		} catch (error) {
			console.log(error);
			return next(
				createError.InternalServerError(
					`${error.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
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
							select: '_id name author privacy',
							populate: [
								{
									path: 'author',
									select: '_id fullname profilePicture isOnline friends',
									populate: { path: 'profilePicture', select: '_id link' },
								},
								{
									path: 'privacy.includes',
									select: '_id fullname profilePicture isOnline',
									populate: {
										path: 'profilePicture',
										select: '_id link',
									},
								},
								{
									path: 'privacy.excludes',
									select: '_id fullname profilePicture isOnline',
									populate: {
										path: 'profilePicture',
										select: '_id link',
									},
								},
							],
						},
						{
							path: 'post',
							select: '_id content author privacy',
							populate: [
								{
									path: 'author',
									select: '_id fullname profilePicture isOnline friends',
									populate: { path: 'profilePicture', select: '_id link' },
								},
								{
									path: 'privacy.includes',
									select: '_id fullname profilePicture isOnline',
									populate: {
										path: 'profilePicture',
										select: '_id link',
									},
								},
								{
									path: 'privacy.excludes',
									select: '_id fullname profilePicture isOnline',
									populate: {
										path: 'profilePicture',
										select: '_id link',
									},
								},
							],
						},
					],
				}
			)
				.then((data) => {
					// check privacy
					// eslint-disable-next-line array-callback-return
					data.docs = data.docs.filter((file) => {
						if (!req.user) {
							console.log(
								file.album && file.album.privacy.value === 'private',
								file.post && file.post.privacy.value === 'private'
							);
							if (file.album || (file.album && file.album.privacy.value === 'private')) {
								return null;
							}
							if (!file.post || (file.post && file.post.privacy.value === 'private')) {
								return null;
							}
							return file;
						}
						if (file.album) {
							return getPostWithPrivacy(file.album, req);
						}
						if (file.post) {
							return getPostWithPrivacy(file.post, req);
						}
					});

					return res.status(200).json({
						totalItems: data.docs.length,
						items: data.docs,
						totalPages: Math.ceil(data.docs.length / limit),
						currentPage: Math.floor(offset / limit),
						offset,
					});
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
