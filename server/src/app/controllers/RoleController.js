const Role = require('../models/Role');
const { getPagination } = require('../../utils/Pagination');
const { getListData } = require('../../utils/Response/listData');
const { responseError } = require('../../utils/Response/error');

class RoleController {
	async create(req, res) {
		try {
			const role = await Role.create(req.body);
			return res.status(201).json(role);
		} catch (error) {
			return responseError(res, 400, error.message);
		}
	}

	async update(req, res) {
		try {
			const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
			return res.status(200).json(role);
		} catch (error) {
			return responseError(res, 400, error.message);
		}
	}

	async getAll(req, res) {
		try {
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			Role.paginate({}, { offset, limit })
				.then((data) => {
					getListData(res, data);
				})
				.catch((err) => responseError(res, 500, err.message));
		} catch (error) {
			console.log(error);
			return res.status(400).send(error);
		}
	}

	async delete(req, res) {
		try {
			const role = await Role.findByIdAndDelete(req.params.id);
			return res.status(200).json(role);
		} catch (error) {
			return responseError(res, 400, error.message);
		}
	}
}

module.exports = new RoleController();
