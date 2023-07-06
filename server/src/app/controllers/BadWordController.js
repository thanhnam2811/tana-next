const createError = require('http-errors');
const { getPagination } = require('../../utils/Pagination');
const { getListData } = require('../../utils/Response/listData');
const { responseError } = require('../../utils/Response/error');
const BadWord = require('../models/BadWord');

class BadWordController {
	async createBadWords(req, res, next) {
		try {
			const { words } = req.body;
			// convert to array string
			const listBadWords = words.toString().split(', ');

			const badword = await BadWord.create({
				words: listBadWords,
			});

			return res.status(200).json(badword);
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

	async updateBadWords(req, res, next) {
		try {
			const { id } = req.params;
			const { words } = req.body;
			const badword = await BadWord.findById(id);
			if (!badword) {
				return responseError(res, 404, 'badword not found');
			}
			badword.words = words.toString().split(', ');
			const result = await badword.save();
			res.status(200).json(result);
		} catch (err) {
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

	async deleteBadWords(req, res, next) {
		try {
			const { id } = req.params;
			const badword = await BadWord.findById(id);
			if (!badword) {
				return responseError(res, 404, 'Badword not found');
			}
			const result = await badword.delete();
			res.status(200).json(result);
		} catch (err) {
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

	async getAllBadWords(req, res, next) {
		try {
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			const { key } = req.query;
			let query = {};
			if (key) {
				query = {
					words: {
						$regex: new RegExp(key),
						$options: 'i',
					},
				};
			}

			const result = await BadWord.paginate(query, {
				offset,
				limit,
				sort: { createdAt: -1 },
			});
			return getListData(res, result);
		} catch (err) {
			next(err);
		}
	}
}

module.exports = new BadWordController();
