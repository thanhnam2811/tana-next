// export const SERVER_URL = 'https://tana-server.herokuapp.com';
// export const SERVER_URL = 'https://TaNa-social-network.hoai-tantan.repl.co';
// export const SERVER_URL =
// 	'http://ec2-18-143-173-205.ap-southeast-1.compute.amazonaws.com';
// export const SERVER_URL = 'https://tana.cleverapps.io';
// export const SERVER_URL = 'https://tana.onrender.com';
// export const SERVER_URL = 'https://tana.up.railway.app';
// export const SERVER_URL = 'https://tana-social.onrender.com';

const isProd = process.env.NODE_ENV === 'production';
export const SERVER_URL = isProd ? 'https://tana-socialz.onrender.com' : 'http://localhost:8800';

export const VERSION = 'nextjs-0.0.2-alpha';
