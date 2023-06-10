module.exports = {
	getListData(res, data) {
		res.status(200).send({
			totalItems: data.totalDocs,
			items: data.docs,
			totalPages: data.totalPages,
			currentPage: data.page - 1,
			offset: data.offset,
		});
	},

	getListPost(res, data, listPost) {
		res.status(200).send({
			totalItems: data.totalDocs,
			items: listPost,
			totalPages: data.totalPages,
			currentPage: data.page - 1,
			offset: data.offset,
		});
	},

	getListUser(res, totalItems, items, totalPages, currentPage, offset) {
		res.status(200).send({
			totalItems,
			items,
			totalPages,
			currentPage,
			offset,
		});
	},
};
