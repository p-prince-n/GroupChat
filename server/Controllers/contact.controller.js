import User from "../models/user.model.js";

export const searchContacts=async(req, res, next)=>{
    try{
        const {searchTerm}=req.body;
        if(!searchTerm) return res.status(400).json({ message: 'Search Term required' })
        const sanitizedSerachterm=searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const regex=new RegExp(sanitizedSerachterm, "i");
        const contacts=await User.find({
            $and:[{_id : {$ne :req.userId}},{$or: [{firstName: regex}, {lastName: regex}, {email: regex}]}],
        });
        if(contacts) {
            const allUser=contacts.map((contact)=>{
                 const { password: _, ...safeUser } = contact.toObject();
                 return safeUser;
            })

            res.status(200).json(allUser)
        }else{
             return res.status(400).json({ message: 'User not found.' })

        }

    }catch{
        res.status(500).json({ message: e.message })
    }
}