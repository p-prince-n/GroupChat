
import { Server as SocketIoServer } from 'socket.io'
import Message from './models/messages.model.js';
import Channel from './models/channel.model.js'

const setupSocket = (server) => {
    const io = new SocketIoServer(server, {
        cors: {
            origin: 'https://chatapp-bbpj.onrender.com',
            
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
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("recieveMessage", messsageData)
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("recieveMessage", messsageData)
        }


    }
    const sendChannelMessage = async (message) => {
        const { channelId, sender, content, messageType, fileUrl } = message;
        const createdMessage = await Message.create({
            sender, recipient: null, content, messageType, fileUrl
        })
        const messageData = await Message.findById(createdMessage._id).populate("sender", "id email firstName lastName image color").exec();
        await Channel.findByIdAndUpdate(channelId, {
            $push: {
                messages: createdMessage._id
            }
        })
        const channel = await Channel.findById(channelId).populate('members');
        const finalData = { ...messageData._doc, channelId: channel._id }
        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString())
                if (memberSocketId) {
                    io.to(memberSocketId).emit('recieve-channel-message', finalData)
                }


            })
            const adminSocketId = userSocketMap.get(channel.admin._id.toString())
            if (adminSocketId) {
                io.to(adminSocketId).emit('recieve-channel-message', finalData)
            }
        }

    }
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);

        } else {
            console.log("User Id not provided during connection.");

        }
        socket.on("sendMessage", sendMessage)
        socket.on("send-channel-message", sendChannelMessage)
        socket.on("disconnect", () => disconnect(socket))
    })

}

export default setupSocket;