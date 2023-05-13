const axios = require('axios');
const { populateUser } = require('../utils/Populate/User');
const apiKey = process.env.API_KEY_VIDEOCALL;

function RoomChat(socket, io) {
    socket.on("joinRoom", (conversationId) => {
        console.log("joinRoom", conversationId);
        socket.join(conversationId);
    });

    // Listen for chatMessage
    socket.on("sendMessage", (msg) => {
        console.log("sendMessage", msg.conversation);
        socket.broadcast.to(msg.conversation).emit("receiveMessage", msg);

    });

    socket.on("leaveRoom", (conversationId) => {
        console.log("leaveRoom", conversationId);
        socket.leave(conversationId);
    });

    // Video call
    socket.on("createVideoCall", async (data)=>{
        // data = {
        //     conversation: conversationId,
        //     caller: userId,
        // }
        const options = {
            method: "POST",
            headers: {
                "Authorization": apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "region": "sg001", "customRoomId": "aaa-bbb-ccc", "webhook": "see example", "autoCloseConfig": "see example" }),
        };
        const url = `https://api.videosdk.live/v2/rooms`;
        const response = await axios(url, options);
        const caller = await populateUser(data.caller);
        socket.broadcast.to(data.conversation).emit("createVideoCall", {
            roomId: response.data.roomId,
            caller
        });

    })

    //typing message
    socket.on("typingMessage", (data) => {
        console.log("typingMessage-----------", data);
        socket.broadcast.to(data.conversation).emit("typingMessage", data);
    });

    socket.on("stopTypingMessage", (data) => {
        console.log("stopTypingMessage-----------");
        socket.broadcast.to(data.conversation).emit("stopTypingMessage", data);
    });

}

module.exports = RoomChat;