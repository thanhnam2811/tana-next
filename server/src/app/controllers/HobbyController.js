const createError = require('http-errors');
const { getPagination } = require('../../utils/Pagination');
const { getListData } = require('../../utils/Response/listData');
const { responseError } = require('../../utils/Response/error');
const Hobby = require('../models/Hobby');

class HobbyController {
	async createNewHobby(req, res, next) {
		try {
			const { name, description } = req.body;
			const hobby = new Hobby({
				name,
				description,
			});
			const result = await hobby.save();
			res.status(200).json(result);
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

	async updateHobby(req, res, next) {
		try {
			const { id } = req.params;
			const { name, description } = req.body;
			const hobby = await Hobby.findById(id);
			if (!hobby) {
				return responseError(res, 404, 'Hobby not found');
			}
			hobby.name = name;
			hobby.description = description;
			const result = await hobby.save();
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

	async deleteHobby(req, res, next) {
		try {
			const { id } = req.params;
			const hobby = await Hobby.findById(id);
			if (!hobby) {
				return responseError(res, 404, 'Hobby not found');
			}
			const result = await hobby.delete();
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

	async getAllHobby(req, res, next) {
		try {
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			const { key } = req.query;
			let query = {};
			if (key) {
				query = {
					name: {
						$regex: new RegExp(key),
						$options: 'i',
					},
				};
			}

			const result = await Hobby.paginate(query, {
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

module.exports = new HobbyController();
