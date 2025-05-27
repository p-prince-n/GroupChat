import Message from "../models/messages.model.js";
import {mkdirSync, renameSync} from 'fs'

export const getMessages=async(req, res)=>{
    try{
        const user1=req.userId;
        const user2=req.body.id
        if(!user1 || !user2) return res.status(400).json({message: 'both user id is required'});
        const messages=await Message.find({
            $or : [
                {sender : user1, recipient : user2},
                {sender : user2, recipient : user1}
            ]
            
    }).sort({timestamp: 1})
    res.status(200).json({messages})

    }catch(e){
        resizeBy.status(500).json({message: e.message})
    }
}

export const uploadFiles=async(req, res, next)=>{
    try{
        if(!req.file) return res.status(400).json({message: 'file is required'});
        const date=Date.now()
        let fileDir=`uploads/files/${date}`;
        let fileName=`${fileDir}/${req.file.originalname}`
        mkdirSync(fileDir, {recursive: true});
        renameSync(req.file.path, fileName)
        res.status(200).json({filePath: fileName});

    }catch(e){
        res.status(500).json({message: e.message})
    }
}