const authMethod = require('../../auth/auth.method');
const { populateUser } = require('../../utils/Populate/User');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

exports.isAuth = async (req, res, next) => {
	// Lấy access token từ header
	const accessTokenFromHeader = req.headers.authorization;
	// Remove "Bearer " in the Authorization header
	const accessToken = accessTokenFromHeader?.replace('Bearer ', '');
	if (!accessToken) {
		return res.status(401).json('Không tìm thấy access token!');
	}

	const verified = await authMethod.verifyToken(accessToken, accessTokenSecret);
	if (!verified) {
		return res.status(401).json('Bạn không có quyền truy cập vào tính năng này!');
	}

	const user = await populateUser(verified.payload.userId);
	req.user = user;

	return next();
};

exports.getUserFromToken = async (req, res, next) => {
	// Lấy access token từ header
	const accessTokenFromHeader = req.headers.authorization;
	// Remove "Bearer " in
	const accessToken = accessTokenFromHeader?.replace('Bearer ', '');
	if (!accessToken) {
		return next();
	}

	const verified = await authMethod.verifyToken(accessToken, accessTokenSecret);

	if (!verified) {
		return next();
	}

	const user = await populateUser(verified.payload.userId);
	req.user = user;

	return next();
};