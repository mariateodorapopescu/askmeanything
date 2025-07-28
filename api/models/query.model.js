import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: String,
  author: String,
  createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.model('Question', questionSchema);
