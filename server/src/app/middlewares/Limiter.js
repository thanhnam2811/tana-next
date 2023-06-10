const { incr, expire, getTime } = require('../../Helpers/limitAccess');

const limiter = async (req, res, next) => {
	try {
		// get IP address of client
		const ipUser = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		const numRequest = await incr(ipUser);
		let timeLeft;
		if (numRequest === 1) {
			await expire(ipUser, 60);
			timeLeft = 60;
		} else {
			timeLeft = await getTime(ipUser);
		}
		if (numRequest > 30) {
			return res
				.status(429)
				.send(`Bạn đã vượt quá số lần truy cập cho phép trong 1 phút. Vui lòng thử lại sau ${timeLeft} giây!`);
		}
		next();
	} catch (err) {
		console.log(err);
	}
};

module.exports = limiter;
