import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    // first_name: {
    //     type: String,
    //     required: true,
    //     min: 3,
    //     max: 20,
    //     unique: false
    // },
    // last_name: {
    //     type: String,
    //     required: true,
    //     min: 3,
    //     max: 20,
    //     unique: false
    // },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 25,
        unique: false 
    },
},
{timestamps: true}
);
const User = mongoose.model('User', userSchema);
export default User;