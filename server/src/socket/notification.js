const { populateUser } = require('../utils/Populate/User');

function notification(socket){
    socket.on("sendRequestFriend",async ({
        senderId,
        receiverId,
    }) => {
        const sender = await populateUser(senderId);
        socket.to(receiverId).emit("reviceRequestFriend",sender)
    });

    socket.on("acceptRequestFriend",async ({
        senderId,
        receiverId,
    }) => {
        const sender = await populateUser(senderId);
        socket.to(receiverId).emit("reviceAcceptRequestFriend",sender)
    });

}

module.exports = notification;