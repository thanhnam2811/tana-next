const createError = require('http-errors');
const Joi = require('joi');
const { getPagination } = require('../../utils/Pagination');
const { getListData } = require('../../utils/Response/listData');
const { responseError } = require('../../utils/Response/error');
const Album = require('../models/Album');
const File = require('../models/File');
const { User } = require('../models/User');
const React = require('../models/React');
const { validatePrivacy } = require('../models/Privacy');
const { getAllPostWithPrivacy, getPostWithPrivacy } = require('../../utils/Privacy/Post');

class AlbumController {
	// create album
	async createAlbum(req, res, next) {
		try {
			const schema = Joi.object({
				name: Joi.string().required(),
				privacy: validatePrivacy,
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return next(createError(400, error.details[0].message));
			}

			const { name, privacy } = req.body;
			const album = await Album.create({
				name,
				author: req.user?._id,
				privacy,
			});

			return res.status(200).json(album);
		} catch (error) {
			console.log(error);
			next(error);
		}
	}

	// add media to album
	async addMediaToAlbum(req, res, next) {
		try {
			const schema = Joi.object({
				media: Joi.array()
					.items(
						Joi.object({
							_id: Joi.string().required(),
							description: Joi.string().allow(''),
						})
					)
					.required(),
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return next(createError(400, error.details[0].message));
			}
			const { media } = req.body;
			const album = await Album.findById(req.params.id);
			if (!album) {
				return next(createError.NotFound('Không tìm thấy album'));
			}
			if (album.author.toString() !== req.user?._id.toString()) {
				return next(createError.Forbidden('Bạn không có quyền thêm media vào album này'));
			}

			// update description of file
			await Promise.all(
				req.body.media.map(async (file) => {
					const fileUpdated = await File.findByIdAndUpdate(
						file._id,
						{
							description: file.description,
							album: album._id,
						},
						{ new: true }
					);
					return fileUpdated;
				})
			);

			const files = media.map((file) => file._id);
			const albumUpdated = await Album.findByIdAndUpdate(
				req.params.id,
				{
					media: files,
					cover: files[files.length - 1],
				},
				{ new: true }
			).populate({
				path: 'cover',
				select: '_id link description',
			});

			return res.status(200).json(albumUpdated);
		} catch (error) {
			next(error);
		}
	}

	// delete item media of album
	async deleteItemMediaOfAlbum(req, res, next) {
		try {
			const { id, mid } = req.params;
			const album = await Album.findById(id);
			if (!album) {
				return next(createError.NotFound('Không tìm thấy album'));
			}

			if (album.author.toString() !== req.user?._id.toString()) {
				return next(createError.Forbidden('Bạn không có quyền xóa media của album này'));
			}

			// find index of item in media
			const index = album.media.findIndex((item) => item.toString() === mid.toString());
			if (index === -1) {
				return next(createError.NotFound('Media không tồn tại trong album'));
			}

			if (index == album.media.length - 1) album.cover = album.media[index - 1];

			// delete item in media
			album.media.splice(index, 1);
			await album.save();

			// populate album
			const albumUpdated = await album.populate({
				path: 'cover',
				select: '_id link description',
			});

			// delete album in media
			await File.deleteOne({ _id: mid });

			return res.status(200).json(albumUpdated);
		} catch (error) {
			next(error);
		}
	}

	// update item media of album
	async updateItemMediaOfAlbum(req, res, next) {
		try {
			const { id, mid } = req.params;
			const album = await Album.findById(id);
			if (!album) {
				return next(createError.NotFound('Không tìm thấy album'));
			}

			if (album.author.toString() !== req.user?._id.toString()) {
				return next(createError.Forbidden('Bạn không có quyền sửa media của album này'));
			}

			// find index of item in media
			const index = album.media.findIndex((item) => item.toString() === mid.toString());
			if (index === -1) {
				return next(createError.NotFound('Media không tồn tại trong album'));
			}

			await File.findByIdAndUpdate(
				mid,
				{
					description: req.body.description,
					album: album._id,
				},
				{ new: true }
			);

			// populate album
			const albumPopulated = await album.populate({
				path: 'cover',
				select: '_id link description',
			});
			return res.status(200).json(albumPopulated);
		} catch (error) {
			next(error);
		}
	}

	// get list album of user
	async getListAlbumByUserId(req, res, next) {
		try {
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			const user = await User.findById(req.params.id);
			if (!user) {
				return next(createError.NotFound('Không tìm thấy người dùng'));
			}
			Album.paginate(
				{ author: req.params.id },
				{
					offset,
					limit,
					sort: { createdAt: -1 },
					populate: [
						{
							path: 'cover',
							select: '_id link description',
						},
						{
							path: 'author',
							select: '_id fullname profilePicture isOnline friends',
							populate: {
								path: 'profilePicture',
								select: '_id link',
							},
						},
					],
				}
			)
				.then(async (data) => {
					const albums = data.docs;
					const listalbums = [];
					if (!req.user) {
						albums.forEach((album) => {
							const albumObject = album.toObject();
							albumObject.reactOfUser = 'none';
							listalbums.push(albumObject);
						});
						// getListalbum(res, data, listalbums);
						const listalbumsFilter = await getAllPostWithPrivacy(listalbums, req);
						// pagination for listalbums
						const listalbumsPaginate = listalbumsFilter.slice(offset, offset + limit);
						res.status(200).send({
							totalItems: listalbumsFilter.length,
							items: listalbumsPaginate,
							totalPages: Math.ceil(listalbums.length / limit),
							currentPage: Math.floor(offset / limit),
							offset,
						});
					} else {
						Promise.all(
							albums.map(async (album) => {
								const albumObject = album.toObject();
								albumObject.reactOfUser = 'none';
								const react = await React.findOne({ album: album._id, user: req.user?._id });
								if (react) {
									albumObject.reactOfUser = react.type;
								}
								listalbums.push(albumObject);
							})
						).then(async () => {
							// sort album by date desc
							listalbums.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
							// getListalbum(res, data, listalbums);
							const listalbumsFilter = await getAllPostWithPrivacy(listalbums, req);
							// pagination for listalbums
							const listalbumsPaginate = listalbumsFilter.slice(offset, offset + limit);
							res.status(200).send({
								totalItems: listalbumsFilter.length,
								items: listalbumsPaginate,
								totalPages: Math.ceil(listalbums.length / limit),
								currentPage: Math.floor(offset / limit),
								offset,
							});
						});
					}
				})
				.catch((err) =>
					responseError(res, 500, err.message ?? 'Some error occurred while retrieving tutorials.')
				);
		} catch (error) {
			next(error);
		}
	}

	// get album
	async getAlbumById(req, res, next) {
		try {
			const { id } = req.params;
			const album = await Album.findById(id)
				.populate({
					path: 'cover',
					select: '_id link description',
				})
				.populate({
					path: 'author',
					select: '_id fullname profilePicture isOnline friends',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				})
				.populate({
					path: 'privacy.includes',
					select: '_id fullname profilePicture isOnline',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				})
				.populate({
					path: 'privacy.excludes',
					select: '_id fullname profilePicture isOnline',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				});
			if (!album) {
				return next(createError(404, 'Album not found'));
			}
			const albumPrivacy = await getPostWithPrivacy(album, req);
			if (!albumPrivacy) {
				return res.status(403).json('Bạn không có quyền xem bài viết này');
			}
			return res.status(200).json(albumPrivacy);
		} catch (error) {
			next(error);
		}
	}

	// get media of album
	async getMediaOfAlbum(req, res, next) {
		try {
			const { id } = req.params;
			const album = await Album.findById(id)
				.populate({
					path: 'author',
					select: '_id fullname profilePicture isOnline friends',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				})
				.populate({
					path: 'privacy.includes',
					select: '_id fullname profilePicture isOnline',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				})
				.populate({
					path: 'privacy.excludes',
					select: '_id fullname profilePicture isOnline',
					populate: {
						path: 'profilePicture',
						select: '_id link',
					},
				});
			if (!album) {
				return next(createError(404, 'Album not found'));
			}
			const albumPrivacy = await getPostWithPrivacy(album, req);
			if (!albumPrivacy) {
				return res.status(403).json('Bạn không có quyền xem bài viết này');
			}
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			File.paginate(
				{ album: id },
				{
					offset,
					limit,
					sort: { createdAt: -1 },
					populate: {
						path: 'creator',
						select: '_id fullname profilePicture isOnline',
						populate: {
							path: 'profilePicture',
							select: '_id link',
						},
					},
				}
			)
				.then((result) => {
					getListData(res, result);
				})
				.catch((err) =>
					responseError(res, 500, err.message ?? 'Some error occurred while retrieving tutorials.')
				);
		} catch (error) {
			next(error);
		}
	}

	// delete album
	async deleteAlbum(req, res, next) {
		try {
			const { id } = req.params;
			const album = await Album.findById(id);
			if (!album) {
				return next(createError(404, 'Album not found'));
			}

			if (album.author.toString() !== req.user?._id.toString())
				return next(createError(403, 'Bạn không có quyền xóa album nàyy'));

			await album.delete();

			return res.status(200).json({ message: 'Album deleted successfully!' });
		} catch (error) {
			next(error);
		}
	}

	// update album
	async updateAlbum(req, res, next) {
		try {
			const schema = Joi.object({
				name: Joi.string().required(),
				privacy: validatePrivacy,
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return next(createError(400, error.details[0].message));
			}

			const { id } = req.params;
			const { name, privacy } = req.body;
			const album = await Album.findById(id);
			if (!album) {
				return next(createError(404, 'Album not found'));
			}

			if (album.author.toString() !== req.user?._id.toString())
				return next(createError(403, 'Bạn không có quyền chỉnh sửa album này'));

			const albumUpdated = await Album.findByIdAndUpdate(
				id,
				{
					name,
					privacy,
				},
				{ new: true }
			).populate({
				path: 'cover',
				select: '_id link description',
			});

			if (!albumUpdated) {
				return next(createError(404, 'Album not found'));
			}

			return res.status(200).json(albumUpdated);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new AlbumController();
