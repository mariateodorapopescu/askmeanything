// api/controllers/question.controller.js
// Logica pentru Anonymous Q&A
// Pattern: controller conține logica, route-ul doar mapează URL → funcție

const Question = require("../models/Question");

// ─────────────────────────────────────────────
// GET /api/questions  →  getAllQuestions
// ─────────────────────────────────────────────
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .sort({ createdAt: -1 })   // cel mai nou primul
      .select("-__v")            // exclude câmpul intern __v
      .lean();                   // plain JS object, mai rapid

    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/questions/:id  →  getQuestionById
// ─────────────────────────────────────────────
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },  // incrementează vizualizările atomic
      { new: true }
    ).select("-__v").lean();

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(question);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid question ID" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// POST /api/questions  →  createQuestion
// ─────────────────────────────────────────────
const createQuestion = async (req, res) => {
  try {
    const { question, answer, tags } = req.body;

    if (!question?.trim()) {
      return res.status(400).json({ message: "Question text is required" });
    }
    if (!answer?.trim()) {
      return res.status(400).json({ message: "Answer text is required" });
    }

    const newQuestion = await Question.create({
      question: question.trim(),
      answer: answer.trim(),
      tags: Array.isArray(tags) ? tags : [],
      author: req.user?._id,   // req.user vine din middleware-ul protect
    });

    res.status(201).json(newQuestion);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// PUT /api/questions/:id  →  updateQuestion
// (folosit de pagina edit_question.tsx)
// ─────────────────────────────────────────────
const updateQuestion = async (req, res) => {
  try {
    const { question, answer, tags } = req.body;

    // Construiește obiectul de update doar cu câmpurile trimise
    const updateData = {};
    if (question !== undefined) updateData.question = question.trim();
    if (answer !== undefined)   updateData.answer   = answer.trim();
    if (tags !== undefined)     updateData.tags     = Array.isArray(tags) ? tags : [];

    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid question ID" });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/questions/:id  →  deleteQuestion
// ─────────────────────────────────────────────
const deleteQuestion = async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({ message: "Question deleted successfully", id: req.params.id });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid question ID" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};