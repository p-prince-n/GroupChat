import { compare, genSalt, hash } from "bcrypt";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { renameSync, mkdirSync, existsSync, unlinkSync } from 'fs';

const maxAge = 7 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge, })
}

export const signUp = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'All fields are required' });

        // const user= await User.create({email, password});
        // res.cookie("jwt", createToken(email, user._id),{
        //     maxAge,
        //     secure: true,
        //     sameSite: 'None',
        // });



        // res.status(201).json(user);
        const user = await User.create({ email, password });

        const { password: _, ...safeUser } = user.toObject(); // Exclude password

        res.cookie("jwt", createToken(email, user._id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });

        res.status(201).json(safeUser);




    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const logIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'All fields are required' });
        // const user = await User.findOne({ email });
        // if (!user) return res.status(404).json({ message: 'User with this email doesn\'t exist. ' });
        // const auth = await compare(password, user.password);
        // if (!auth) return res.status(400).json({ message: 'Incorrect Password ' });
        // res.cookie("jwt", createToken(email, user._id), {
        //     maxAge,
        //     secure: true,
        //     sameSite: 'None',
        // })
        // res.status(200).json(user);
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User with this email doesn't exist." });

        const auth = await compare(password, user.password);
        if (!auth) return res.status(400).json({ message: "Incorrect Password" });

        const { password: _, ...safeUser } = user.toObject();

        res.cookie("jwt", createToken(email, user._id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });

        res.status(200).json(safeUser);


    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const getUserInfo = async (req, res, next) => {
    try {
        const userData = await User.findById(req.userId);
        if (!userData) return res.status(404).json({ message: 'User with this id doesn\'t exist. ' });
        const { password: _, ...safeUser } = userData.toObject();

        res.status(200).json(safeUser);


    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const { userId } = req;
        const { firstName, lastName, color } = req.body;
        console.log(req.body);
        
        if (!firstName || !lastName || color<0) return res.status(400).json({ message: 'firstName, lastname nad color are required fields.' });
        const userData = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                color,
                profileSetup: true,
            },
            { new: true, runValidators: true }
        );

        const { password: _, ...safeUser } = userData.toObject();

        res.status(200).json(safeUser);


    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const addProfileImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(404).json({ message: 'File is required' });

    const date = Date.now();
    const uploadsDir = "uploads/profiles";

    // ✅ Create directory if it doesn't exist
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `${uploadsDir}/${date}-${req.file.originalname}`;
    renameSync(req.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { image: fileName },
      { new: true, runValidators: true }
    );

    res.status(200).json({ image: updatedUser.image });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
export const removeProfileImage=async(req, res, next)=>{
    try{
        const {userId}=req;
        const user= await User.findById(userId);
        if(!user) return res.status(404).json({ message: 'User Not Found ' });
        if(user.image) unlinkSync(user.image);
        user.image=null;
        await user.save();
        return res.status(200).send("Profile image removed successfully");

    }catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const logOut=async(req, res, next)=>{
    try{
        res.cookie("jwt", "", {maxAge: 1, secure: true,sameSite: 'None'})
        return res.status(200).send("Log out successfully");

    }catch (e) {
        res.status(500).json({ message: e.message })
    }
}