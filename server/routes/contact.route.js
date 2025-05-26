import express from 'express';
import { verifiedtoken } from '../middleware/auth.middleware.js';
import { searchContacts } from '../Controllers/contact.controller.js';

const contactRoute=express.Router();

contactRoute.post('/search', verifiedtoken, searchContacts)
export default contactRoute;