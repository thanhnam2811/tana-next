const isProd = require('./environment');

const PRO_HOST = [
    process.env.HOST_ADMIN,
    process.env.HOST_CLIENT,
];

const HOSTS = isProd ? PRO_HOST : '*';

module.exports = HOSTS;