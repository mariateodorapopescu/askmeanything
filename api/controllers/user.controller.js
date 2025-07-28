import User from '../models/user.model.js';

export const test = (req, res) => {
    res.json({message: "ceva"}); 
};
export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find(); // toți userii din colecție
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: 'Eroare la preluarea utilizatorilor', details: err.message });
    }
  };