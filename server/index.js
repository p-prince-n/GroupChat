import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRouter from './routes/auth.route.js';
import contactRoute from './routes/contact.route.js';
import setupSocket from './socket.js';
import messageRoute from './routes/message.route.js';
import channelRoute from './routes/channel.route.js';
dotenv.config();
const app=express();

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true

}))

app.use('/uploads/profiles', express.static("uploads/profiles"))
app.use('/uploads/files', express.static("uploads/files"))
app.use(cookieParser());
app.use(express.json());

const PORT=process.env.PORT || 4000;

app.use('/api/auth', authRouter)
app.use('/api/contacts', contactRoute)
app.use('/api/messages', messageRoute)
app.use('/api/channel', channelRoute)

const server=app.listen(PORT, ()=>{
    console.log(`server started at http://localhost:${PORT}`);
    
})
setupSocket(server)

mongoose.connect(process.env.DB_URI).then((val)=>console.log('db connected successfully'));
