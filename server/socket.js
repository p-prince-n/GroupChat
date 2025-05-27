
import { Server as SocketIoServer } from 'socket.io'
import Message from './models/messages.model.js';

const setupSocket = (server) => {
    const io = new SocketIoServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        }
    })

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }

    }

    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender)
        const recipientSocketId = userSocketMap.get(message.recipient)
        const createMessage = await Message.create(message);
        const messsageData = await Message.findById(createMessage._id).populate('sender', "id email firstName lastName image color").populate('recipient', "id email firstName lastName image color")
        if(recipientSocketId){
            io.to(recipientSocketId).emit("recieveMessage", messsageData)
        }
        if(senderSocketId){
            io.to(senderSocketId).emit("recieveMessage", messsageData)
        }


    }
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected : ${userId} with socket id : ${socket.id}`);
            console.log("Current socket map:", Array.from(userSocketMap.entries()));

        } else {
            console.log("User Id not provided during connection.");

        }
        socket.on("sendMessage", sendMessage)
        socket.on("disconnect", () => disconnect(socket))
    })

}

export default setupSocket;