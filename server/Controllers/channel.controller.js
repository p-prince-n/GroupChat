import mongoose from "mongoose";
import Channel from "../models/channel.model.js";
import User from "../models/user.model.js";

export const createChannel=async(req, res, next)=>{
    try {
        const {name, members}=req.body;
        const userId=req.userId;
        const admin=await User.findById(userId);
        if(!admin) return res.status(400).json({message: 'Admin User not found'})
        const validMemebers=await User.find({_id : {$in : members}});
        if(validMemebers.length !== members.length ) return res.status(400).json({message: 'some members are not valid users.'});
        const newChannel= await Channel({
            name, members, admin:userId,
        })
        await newChannel.save();
        res.status(201).json({newChannel});

        
    } catch (error) {
        res.status(500).json({message: e.message})
        
    }
}


export const getUserChannel=async(req, res, next)=>{
    try{
        const userId=new mongoose.Types.ObjectId(req.userId);
        const channels=await Channel.find({
            $or: [
                {admin: userId},
                {members: userId},
            ]
        }).sort({updatedAt: -1})
        res.status(200).json({channels})

    }catch (error) {
        res.status(500).json({message: e.message})
        
    }

}