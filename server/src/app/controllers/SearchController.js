const createError = require('http-errors');
const { getPagination } = require('../../utils/Pagination');
const { getListData } = require('../../utils/Response/listData');
const { responseError } = require('../../utils/Response/error');
const { User, validate } = require('../models/User');
const Post = require('../models/Post');

class SearchController {
	async searchUserAndPost(req, res, next) {
		try {
			const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
			const { keyword } = req.query;
			const result = await Promise.all([
				User.find({
					$or: [
						{ fullname: { $regex: keyword, $options: 'i' } },
						{ email: { $regex: keyword, $options: 'i' } },
					],
				})
					.limit(limit)
					.skip(offset),

				Post.find({ content: { $regex: keyword, $options: 'i' } })
					.limit(limit)
					.skip(offset),
			]);

			const [users, posts] = result;

			res.status(200).json({
				users,
				posts,
			});
		} catch (err) {
			next(err);
		}
	}
}

module.exports = new SearchController();
