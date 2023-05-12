import { isProd } from './config';

const PROD_SERVER_URL = 'https://server.tana.social';
const DEV_SERVER_URL = 'http://localhost:8800';
export const SERVER_URL = isProd ? PROD_SERVER_URL : DEV_SERVER_URL;
