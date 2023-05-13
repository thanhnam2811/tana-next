const Role = require('../models/Role');
const { getPagination } = require('../../utils/Pagination');

class RoleController {
    async create(req, res) {
        try {
            const role = await Role.create(req.body);
            return res.status(201).send(role);
        } catch (error) {
            return res.status(400).send(error);
        }
    }

    async update(req, res) {
        try {
            const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return res.status(200).send(role);
        } catch (error) {
            return res.status(400).send(error);
        }
    }

    async getAll(req, res) {
        try {
            const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
            Role.paginate({}, { offset, limit })
                .then(data => {
                    res.send({
                        totalItems: data.totalDocs,
                        items: data.docs,
                        totalPages: data.totalPages,
                        currentPage: data.page - 1,
                        offset: data.offset,
                    });
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while retrieving roles."
                    });
                });
        } catch (error) {
            console.log(error);
            return res.status(400).send(error);
        }
    }

}

module.exports = new RoleController();