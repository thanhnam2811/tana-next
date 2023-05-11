exports.IsUser = async (req, res, next) => {
	if (req.user.role.name === 'USER') {
		return next();
	}
	return res.status(401).send('Không có quyền truy cập!!!!!!!!');
};
exports.IsAdmin = async (req, res, next) => {
	if (req.user.role.name === 'ADMIN') {
		return next();
	}
	return res.status(401).send('Không có quyền truy cập!!!!!');
};
