import express from 'express';
import { verifiedtoken } from '../middleware/auth.middleware.js';
import { createChannel, getUserChannel, getChannelMessages } from '../Controllers/channel.controller.js';

const channelRoute= express.Router();

channelRoute.post('/create-channel', verifiedtoken, createChannel)
channelRoute.get('/get-user-channels', verifiedtoken, getUserChannel)
channelRoute.get('/get-channel-messages/:channelId', verifiedtoken, getChannelMessages)

export default channelRoute;