// auth.controller.js - Actualizat cu Google OAuth

import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

// ==================== SIGNUP NORMAL ====================
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    
    const isBlank = (str) => !str || str.trim().length === 0;
    
    if (isBlank(username) || isBlank(password) || isBlank(email)) {
        return next(errorHandler(400, "All fields required"));
    }
    
    const hashedpasswd = bcrypt.hashSync(password, 10);
    const newUser = new User({
        username: username, 
        email: email, 
        password: hashedpasswd,
        authProvider: 'local'
    });
    
    try {
        await newUser.save();
        res.status(201).json({ message: "User created" });
    } catch (e) {
        next(e);
    }
};

// ==================== SIGNIN NORMAL ====================
export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return next(errorHandler(400, "Email and password required"));
    }
    
    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }
        
        // Verifică dacă userul s-a înregistrat cu Google
        if (user.authProvider === 'google' && !user.password) {
            return next(errorHandler(400, "This account uses Google Sign-In. Please use 'Continue with Google'."));
        }
        
        const validPassword = bcrypt.compareSync(password, user.password);
        
        if (!validPassword) {
            return next(errorHandler(401, "Invalid password"));
        }
        
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        // Nu trimite password-ul în response
        const { password: pass, ...userData } = user._doc;
        
        res.status(200)
            .cookie('access_token', token, { httpOnly: true })
            .json({ 
                success: true,
                token,
                user: userData 
            });
            
    } catch (e) {
        next(e);
    }
};

// ==================== GOOGLE AUTH ====================
export const google = async (req, res, next) => {
    const { access_token } = req.body;
    
    if (!access_token) {
        return next(errorHandler(400, "Access token required"));
    }
    
    try {
        // Verifică token-ul cu Google și obține info despre user
        const googleResponse = await fetch(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
                headers: { 'Authorization': `Bearer ${access_token}` }
            }
        );
        
        if (!googleResponse.ok) {
            return next(errorHandler(401, "Invalid Google token"));
        }
        
        const googleUser = await googleResponse.json();
        
        const { email, name, picture, sub: googleId } = googleUser;
        
        if (!email) {
            return next(errorHandler(400, "Email not provided by Google"));
        }
        
        // Caută user după email
        let user = await User.findOne({ email });
        
        if (user) {
            // User există - actualizează datele de la Google
            user.googleId = googleId;
            user.picture = picture;
            user.name = name;
            user.authProvider = user.authProvider === 'local' ? 'local' : 'google';
            await user.save();
        } else {
            // User nou - creează cont
            // Generează username unic din email
            const baseUsername = email.split('@')[0];
            let username = baseUsername;
            let counter = 1;
            
            // Verifică dacă username-ul există și adaugă număr dacă da
            while (await User.findOne({ username })) {
                username = `${baseUsername}${counter}`;
                counter++;
            }
            
            user = new User({
                username,
                email,
                name,
                picture,
                googleId,
                authProvider: 'google',
                password: null  // Nu are parolă, e Google auth
            });
            
            await user.save();
        }
        
        // Creează JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        // Nu trimite password-ul în response
        const { password, ...userData } = user._doc;
        
        res.status(200)
            .cookie('access_token', token, { httpOnly: true })
            .json({
                success: true,
                token,
                user: userData
            });
            
    } catch (e) {
        console.error('Google auth error:', e);
        next(errorHandler(500, "Authentication failed"));
    }
};

// ==================== VERIFY TOKEN ====================
export const verifyToken = async (req, res, next) => {
    const token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return next(errorHandler(401, "No token provided"));
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }
        
        res.status(200).json({
            valid: true,
            user
        });
        
    } catch (e) {
        return next(errorHandler(401, "Invalid token"));
    }
};

// ==================== SIGNOUT ====================
export const signout = (req, res) => {
    res.clearCookie('access_token')
        .status(200)
        .json({ success: true, message: 'Signed out successfully' });
};