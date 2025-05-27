import express from 'express'
import { verifiedtoken } from '../middleware/auth.middleware.js';
import { getMessages, uploadFiles } from '../Controllers/message.controller.js';
import multer from 'multer'

const messageRoute=express.Router();
const upload=multer({dest: "uploads/files"})
messageRoute.post('/get-messages',verifiedtoken, getMessages)
messageRoute.post('/upload-files', verifiedtoken, upload.single("file"), uploadFiles)

export default messageRoute;