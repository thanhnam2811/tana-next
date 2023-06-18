module.exports = {
	responseError(res, statusCode, message) {
		res.status(statusCode).json({
			error: {
				message,
			},
		});
	},
};
