import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
    // console.log(req.body);
    const {username, email, password } = req.body;
    // console.log(username);
    // console.log(email);
    // console.log(password);
    function isBlank(str) {
        return str.trim().length === 0;
      };
    if (!username || !password || !email || username === '' || password === '' || email === '' || isBlank(username) || isBlank(password) || isBlank(email)) {
        // return res.status(406).json({message: "All fields are required"});
        next(errorHandler(400, "All fields required"));
    }
    const hashedpasswd = bcrypt.hashSync(password, 10);
    const newUser = new User(
        {
            username: username, 
            email: email, 
            password: hashedpasswd
        }
    );
    try {
        await newUser.save();
        res.status(201).json({message: "User created"});
    }catch (e) {
        // res.status(501).json({message: "Off, a crapat =(", err: e.errmsg});
        next(e);
    }
    
};
