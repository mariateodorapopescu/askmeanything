// import mongoose from "mongoose";
// const userSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true,
//         min: 3,
//         max: 20,
//         unique: true
//     },
//     email: {
//         type: String,
//         required: true,
//         min: 3,
//         max: 20,
//         unique: true
//     },
//     // first_name: {
//     //     type: String,
//     //     required: true,
//     //     min: 3,
//     //     max: 20,
//     //     unique: false
//     // },
//     // last_name: {
//     //     type: String,
//     //     required: true,
//     //     min: 3,
//     //     max: 20,
//     //     unique: false
//     // },
//     password: {
//         type: String,
//         required: true,
//         min: 8,
//         max: 25,
//         unique: false 
//     },
// },
// {timestamps: true}
// );
// const User = mongoose.model('User', userSchema);
// export default User;

// user.model.js - Actualizat cu suport pentru Google Auth

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
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: false,  // ← Schimbat! Nu mai e required pentru Google users
        min: 8,
        max: 25,
        unique: false 
    },
    // ========== Câmpuri noi pentru Google Auth ==========
    googleId: {
        type: String,
        unique: true,
        sparse: true  // Permite null/undefined să nu fie unice
    },
    picture: {
        type: String,
        default: null
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    name: {
        type: String,
        default: null
    }
},
{ timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;