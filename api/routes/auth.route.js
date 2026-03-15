// import express from 'express';
// import {signup} from '../controllers/auth.controller.js';

// const router = express.Router();
// router.post ('/signup', signup); 
// export default router; 

// auth.route.js - Route-uri pentru autentificare

import express from 'express';
import { 
    signup, 
    signin, 
    google, 
    verifyToken, 
    signout 
} from '../controllers/auth.controller.js';

const router = express.Router();

// Register cu email/password
router.post('/signup', signup);

// Login cu email/password
router.post('/signin', signin);

// Login/Register cu Google
router.post('/google', google);

// Verifică token-ul (pentru persistența sesiunii)
router.get('/verify', verifyToken);

// Logout
router.post('/signout', signout);

export default router;