const http = require('http');
require('dotenv').config();
const socketio = require('socket.io');

const app = require('./app');

const server = http.createServer(app);
const HOSTS = require('./configs/cors');

// socket
const io = socketio(server, {
	cors: {
		origin: HOSTS,
	},
});
// const io = socketio(server);
const Socket = require('./socket/index');

Socket(io);

// require db
const db = require('./configs/db/index');
// connect to DB
db.connect();

// 127.0.0.1 - localhost
const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
	console.log(`Backend server is listening on port ${PORT}`);
});
