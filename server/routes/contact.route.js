import express from 'express';
import { verifiedtoken } from '../middleware/auth.middleware.js';
import { getContactsforDMList, searchContacts } from '../Controllers/contact.controller.js';

const contactRoute=express.Router();

contactRoute.post('/search', verifiedtoken, searchContacts)
contactRoute.get('/get-contacts-dm', verifiedtoken, getContactsforDMList)
export default contactRoute;