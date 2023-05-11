const redisClient = require('../configs/redis/index');

const incr = async (key) => {
	try {
		const count = await redisClient.incr(key);
		return count;
	} catch (err) {
		console.log(err);
	}
};

const expire = async (key, time) => {
	try {
		await redisClient.expire(key, time);
	} catch (err) {
		console.log(err);
	}
};

const getTime = async (key) => {
	try {
		const time = await redisClient.ttl(key);
		return time;
	} catch (err) {
		console.log(err);
	}
};

module.exports = {
	incr,
	expire,
	getTime,
};
