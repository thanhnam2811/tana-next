const redis = require('ioredis');

const redisClient = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    connectTimeout: 10000,
});

redisClient.on('connect', () => {
    console.log('connected to redis successfully!');
})

redisClient.on('error', (error) => {
    console.log('Redis connection error :', error);
})

module.exports = redisClient;
