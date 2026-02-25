import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true

    },
    firstName: {
        type: String,
        required: true,


    },
    lastName: {
        type: String,
        required: true

    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
    phone: {
        type: String,
        required: true,
        default: "Not given"
    },
    isDisabled:{
        type:Boolean,
        required:true,
        default:false,
    },
    isEmailedVerified:{
        type:Boolean,
        required:true,
        default:false
    },
    image:{

    }


})
const User = mongoose.model("users",userSchema)
export default User;
