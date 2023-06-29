const createError = require('http-errors');
const { Types } = require('mongoose');
const { getPagination } = require('../../utils/Pagination');
const { getListData } = require('../../utils/Response/listData');
const { responseError } = require('../../utils/Response/error');
const List = require('../models/List');

class ListController {
	async createList(req, res, next) {
		try {
			const { key, name, isPrivate } = req.body;

			const existed = await List.findOne({ key });
			if (existed) return responseError(res, 409, `Danh sách với key: '${key}' đã tồn tại!`);

			const list = await List.create({
				key,
				name,
				isPrivate,
			});
			return res.status(201).json(list);
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

	async updateList(req, res, next) {
		try {
			const {
				params: { id },
				body: { key, name, isPrivate },
			} = req;

			const update = { key, name, isPrivate };
			const options = { new: true };

			const isMongoId = Types.ObjectId.isValid(id);
			const list = isMongoId
				? await List.findByIdAndUpdate(id, update, options)
				: await List.findOneAndUpdate({ key: id }, update, options);
			if (!list) return responseError(res, 404, 'Không tìm thấy danh sách!');

			res.status(200).json(list);
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

	async deleteList(req, res, next) {
		try {
			const { id } = req.params;

			const isMongoId = Types.ObjectId.isValid(id);
			const list = isMongoId ? await List.findByIdAndDelete(id) : await List.findOneAndDelete({ key: id });
			if (!list) return responseError(res, 404, 'Không tìm thấy danh sách!');

			res.status(200).json(list);
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

	async getList(req, res, next) {
		try {
			const {
				user,
				params: { id },
			} = req;

			const isMongoId = Types.ObjectId.isValid(id);
			const query = isMongoId ? { _id: id } : { key: id };
			if (!user || user.role.name !== 'ADMIN') query.isPrivate = false;

			const list = await List.findOne(query);
			if (!list) return responseError(res, 404, 'Không tìm thấy danh sách!');

			res.status(200).json(list);
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

	async getLists(req, res, next) {
		try {
			const query = {};
			const { key, search = 'key,name' } = req.query;
			if (key) {
				const searchFields = search.split(',').map((field) => field.trim());

				query.$or = searchFields.map((field) => ({ [field]: { $regex: key, $options: 'i' } }));
			}

			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			const lists = await List.paginate(query, { offset, limit });
			getListData(res, lists);
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

	async addDataToList(req, res, next) {
		try {
			const { id } = req.params;
			const { items } = req.body;

			if (!Array.isArray(items)) return responseError(res, 400, 'Dữ liệu phải là một mảng!');
			if (items.some((item) => typeof item !== 'string'))
				return responseError(res, 400, 'Dữ liệu phải là một mảng các chuỗi!');

			const isMongoId = Types.ObjectId.isValid(id);
			const list = isMongoId ? await List.findById(id) : await List.findOne({ key: id });
			if (!list) return responseError(res, 404, 'Không tìm thấy danh sách!');

			const itemSet = new Set([...list.items, ...items.map((item) => item.trim().toLowerCase())]);
			list.items = [...itemSet];

			const result = await list.save();
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

	async removeDataFromList(req, res, next) {
		try {
			const { id } = req.params;
			const { items } = req.body;

			if (!Array.isArray(items)) return responseError(res, 400, 'Dữ liệu phải là một mảng!');
			if (items.some((item) => typeof item !== 'string'))
				return responseError(res, 400, 'Dữ liệu phải là một mảng các chuỗi!');

			const isMongoId = Types.ObjectId.isValid(id);
			const list = isMongoId ? await List.findById(id) : await List.findOne({ key: id });
			if (!list) return responseError(res, 404, 'Không tìm thấy danh sách!');

			const itemSet = new Set([...list.items]);
			items.forEach((item) => itemSet.delete(item));

			list.items = [...itemSet];

			const result = await list.save();
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
}

module.exports = new ListController();
