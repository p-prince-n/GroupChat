import jwt from 'jsonwebtoken'

export const verifiedtoken=(req, res, next)=>{
    const token=req.cookies.jwt;
    if(!token) return res.status(400).json({message: 'You are not authorized'});
    jwt.verify(token, process.env.JWT_KEY, async(err, payload)=>{
        if(err) return res.status(400).json({message: 'Token is not valid'});
        req.userId=payload.userId;
        next();
    })

}