const PROD_SERVER_URL = 'https://server.tana.social';
const DEV_SERVER_URL = 'http://localhost:8800';

const isProd = process.env.NODE_ENV === 'production';
export const SERVER_URL = isProd ? PROD_SERVER_URL : DEV_SERVER_URL;

export const VERSION = 'nextjs-0.0.2-alpha';
