import express from 'express';
import {test} from '../controllers/user.controller.js';
import { getAllUsers } from '../controllers/user.controller.js';

const router = express.Router();
router.get('/test', test); 

router.get('/users', async (req, res) => {
  try {
    const users = await userSchema.find(); // poate adaugi `.select('-password')` dacă vrei fără parole
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Eroare la extragerea userilor', details: err.message });
  }
});
router.get('/', getAllUsers); 
export default router; 