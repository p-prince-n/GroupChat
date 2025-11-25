import { compare} from "bcrypt";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinaryConfig.js";

const maxAge = 7 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge, })
}

export const signUp = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'All fields are required' });

        const user = await User.create({ email, password });

        const { password: _, ...safeUser } = user.toObject(); // Exclude password

        res.cookie("jwt", createToken(email, user._id), {
            maxAge,
            httpOnly: true,
            secure: true,
            secure: process.env.NODE_ENV === 'production',
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
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User with this email doesn't exist." });

        const auth = await compare(password, user.password);
        if (!auth) return res.status(400).json({ message: "Incorrect Password" });

        const { password: _, ...safeUser } = user.toObject();

        res.cookie("jwt", createToken(email, user._id), {
            maxAge,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
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
    const { image } = req.body;

    if (!image)
      return res.status(400).json({ message: "Image is required (send base64)" });

    // Upload Base64 directly to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: "chatApp/profiles",
      resource_type: "image",
      transformation: [{ width: 400, height: 400, crop: "fill" }],
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        image: result.secure_url,
        imagePublicId: result.public_id,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ image: updatedUser.image });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const removeProfileImage = async (req, res, next) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If user already has a Cloudinary image → delete it
    if (user.imagePublicId) {
      await cloudinary.uploader.destroy(user.imagePublicId);
    }

    user.image = null;
    user.imagePublicId = null;
    await user.save();

    return res.status(200).json({ message: "Profile image removed successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


export const logOut=async(req, res, next)=>{
    try{
        res.cookie("jwt", "", {maxAge: 1,httpOnly: true, secure: process.env.NODE_ENV === 'production',sameSite: 'None'})
        return res.status(200).send("Log out successfully");

    }catch (e) {
        res.status(500).json({ message: e.message })
    }
}