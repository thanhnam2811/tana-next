const createError = require('http-errors');
const Joi = require('joi');
const { getPagination } = require('../../utils/Pagination');
const { getListPost, getListData } = require('../../utils/Response/listData');
const { responseError } = require('../../utils/Response/error');
const Album = require('../models/Album');
const File = require('../models/File');
const { validatePrivacy } = require('../models/Privacy');

class AlbumController {
	// create album
	async createAlbum(req, res, next) {
		try {
			const schema = Joi.object({
				name: Joi.string().required(),
				media: Joi.array()
					.items(
						Joi.object({
							file: Joi.string().required(),
							description: Joi.string(),
						})
					)
					.required(),
				privacy: validatePrivacy,
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return next(createError(400, error.details[0].message));
			}

			const { name, media, privacy } = req.body;
			const files = media.map((file) => file.file);
			const album = await Album.create({
				name,
				media: files,
				user: req.user._id,
				privacy,
			});

			// update description of file
			await Promise.all(
				req.body.media.map(async (file) => {
					const fileUpdated = await File.findByIdAndUpdate(
						file.file,
						{
							description: file.description,
							album: album._id,
						},
						{ new: true }
					);
					return fileUpdated;
				})
			);

			// populate album
			const albumPopulated = await album.populate({
				path: 'media',
				select: '_id link description',
			});
			return res.status(200).json(albumPopulated);
		} catch (error) {
			next(error);
		}
	}

	// get list album of user
	async getListAlbum(req, res, next) {
		try {
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			Album.paginate(
				{ user: req.user._id },
				{
					offset,
					limit,
					sort: { createdAt: -1 },
					populate: {
						path: 'media',
						select: '_id link description',
					},
				}
			)
				.then((data) => {
					getListData(res, data);
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
			const album = await Album.findById(id).populate({
				path: 'media',
				select: '_id link description',
			});
			if (!album) {
				return next(createError(404, 'Album not found'));
			}
			return res.status(200).json(album);
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

			if (album.user.toString() !== req.user._id.toString())
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
				media: Joi.array()
					.items(
						Joi.object({
							file: Joi.string().required(),
							description: Joi.string(),
						})
					)
					.required(),
				privacy: validatePrivacy,
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return next(createError(400, error.details[0].message));
			}

			const { id } = req.params;
			const { name, media, privacy } = req.body;

			const files = media.map((file) => file.file);
			const albumUpdated = await Album.findByIdAndUpdate(
				id,
				{
					name,
					media: files,
					privacy,
				},
				{ new: true }
			).populate({
				path: 'media',
				select: '_id link description',
			});

			await Promise.all(
				req.body.media.map(async (file) => {
					const fileUpdated = await File.findByIdAndUpdate(
						file.file,
						{
							description: file.description,
							album: albumUpdated._id,
						},
						{ new: true }
					);
					return fileUpdated;
				})
			);

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