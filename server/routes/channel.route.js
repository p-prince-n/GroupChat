import express from 'express';
import { verifiedtoken } from '../middleware/auth.middleware.js';
import { createChannel, getUserChannel } from '../Controllers/channel.controller.js';

const channelRoute= express.Router();

channelRoute.post('/create-channel', verifiedtoken, createChannel)
channelRoute.get('/get-user-channels', verifiedtoken, getUserChannel)

export default channelRoute;