const RoomChat = require('./RoomChat');
const AccessController = require('../app/controllers/AccessController');
const { User } = require('../app/models/User');

function socket(io) {
    io.on('connection', (socket) => {
        console.log('New WS Connection...', socket.id);
        let userID;
        socket.on('login', async (data) => {
            userID = data;
            // console.log('online', userID);
            try {
                //data is userID
                await AccessController.updateAccessInDay();

                // Update user isOnline
                await User.findByIdAndUpdate(userID, {
                    isOnline: true,
                });
            } catch (err) {
                console.log(err);
            }
        });

        RoomChat(socket, io);

        // Runs when client disconnects
        socket.on('disconnect', async () => {
            // console.log('Client disconnected', userID);
            try {
                // Update user isOnline
                await User.findByIdAndUpdate(userID, {
                    isOnline: false,
                    lastAccess: Date.now()
                });
            } catch (err) {
                console.log(err);
            }
        });
    });
}

module.exports = socket;
