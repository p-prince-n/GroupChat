import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt";

const UserSchema=new mongoose.Schema({
    email: {
        type: String,
        trim:true,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    color: {
        type: Number,
        required: false,
    },
    profileSetup:{
        type: Boolean,
        default: false,
    }
}, {timestamps: true})


UserSchema.pre("save", async function (next) {
    const salt=await genSalt();
    this.password=await hash(this.password, salt);
    next();
    
});

const User=mongoose.model('User', UserSchema);
export default User;

