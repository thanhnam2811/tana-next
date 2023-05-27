const axios = require('axios');
const { populateUser } = require('../utils/Populate/User');
const apiKey = process.env.API_KEY_VIDEOCALL;
const Conversation = require('../app/models/Conversation');
const SocketManager = require('./SocketManager');

function RoomChat(socket, io) {
    // socket.on("joinRoom", (conversationId) => {
    //     console.log("joinRoom", conversationId);
    //     socket.join(conversationId);
    // });

    // Listen for chatMessage
    socket.on("sendMessage", async (msg) => {
        console.log("sendMessage", msg.conversation);
        const conversation = await Conversation.findById(msg.conversation);
        if(!conversation)
            return;
        
        conversation.members.forEach(
            member => {
                if(member.user.toString() !== msg.sender._id.toString()){
                    const sk = SocketManager.getUser(member.user);
                    if(sk)
                        sk.emit("receiveMessage", msg);
                }
            }
        )

    });

    // socket.on("leaveRoom", (conversationId) => {
    //     console.log("leaveRoom", conversationId);
    //     socket.leave(conversationId);
    // });

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

        const conversation = await Conversation.findById(msg.conversation);
        if(!conversation)
            return;
        
        conversation.members.forEach(
            member => {
                if(member.user.toString() !== msg.sender._id.toString()){
                    const sk = SocketManager.getUser(member.user);
                    if(sk)
                        sk.emit("createVideoCall", {
                            roomId: response.data.roomId,
                            caller
                        });
                }
            }
        )

    })

    //typing message
    socket.on("typingMessage", async (data) => {
        console.log("typingMessage-----------", data);
        const conversation = await Conversation.findById(msg.conversation);
        if(!conversation)
            return;
        
        conversation.members.forEach(
            member => {
                if(member.user.toString() !== msg.sender._id.toString()){
                    const sk = SocketManager.getUser(member.user);
                    if(sk)
                        sk.emit("typingMessage", data);
                }
            }
        )
    });

    socket.on("stopTypingMessage", async (data) => {
        console.log("stopTypingMessage-----------");
        const conversation = await Conversation.findById(msg.conversation);
        if(!conversation)
            return;
        
        conversation.members.forEach(
            member => {
                if(member.user.toString() !== msg.sender._id.toString()){
                    const sk = SocketManager.getUser(member.user);
                    if(sk)
                        sk.emit("stopTypingMessage", data);
                }
            }
        )
    });

}

module.exports = RoomChat;