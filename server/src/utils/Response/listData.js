module.exports = {
	getListData: function (res, data) {
		res.status(200).send({
			totalItems: data.totalDocs,
			items: data.docs,
			totalPages: data.totalPages,
			currentPage: data.page - 1,
			offset: data.offset,
		});
	},

	getListPost: function (res, data, listPost) {
		res.status(200).send({
			totalItems: data.totalDocs,
			items: listPost,
			totalPages: data.totalPages,
			currentPage: data.page - 1,
			offset: data.offset,
		});
	},

	getListUser: function (res, totalItems, items, totalPages, currentPage, offset) {
		res.status(200).send({
			totalItems: totalItems,
			items: items,
			totalPages: totalPages,
			currentPage: currentPage,
			offset: offset,
		});
	},
};
