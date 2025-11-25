import express from 'express';
import { logIn, signUp, getUserInfo, updateProfile, addProfileImage, removeProfileImage, logOut } from '../Controllers/auth.controller.js';
import { verifiedtoken } from '../middleware/auth.middleware.js';


const authRouter=express.Router();

authRouter.post('/signUp', signUp);
authRouter.post('/logIn', logIn)
authRouter.get('/userInfo', verifiedtoken, getUserInfo) 
authRouter.post('/update-profile',  verifiedtoken, updateProfile)  
authRouter.post("/add-profile-image", verifiedtoken, addProfileImage);
authRouter.delete("/remove-profile-image", verifiedtoken, removeProfileImage);
authRouter.post('/logOut', verifiedtoken, logOut) 


export default authRouter;