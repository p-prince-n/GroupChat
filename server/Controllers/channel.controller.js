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