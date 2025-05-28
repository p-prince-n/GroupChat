import express from 'express';
import { verifiedtoken } from '../middleware/auth.middleware.js';
import { createChannel } from '../Controllers/channel.controller.js';

const channelRoute= express.Router();

channelRoute.post('/create-channel', verifiedtoken, createChannel)

export default channelRoute;