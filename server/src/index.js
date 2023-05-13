const http = require('http');
require('dotenv').config();
const app = require('./app');
const server = http.createServer(app);

//socket
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
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
