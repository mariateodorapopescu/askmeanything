// api/routes/question.route.js
// Mapează URL-urile → funcțiile din controller
// Același pattern ca auth.route.js

const express = require("express");
const router  = express.Router();

const {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/question.controller");

// Importă middleware-ul de autentificare — același ca în auth.route.js
// Schimbă calea dacă e diferită la tine
const { protect } = require("../middleware/auth");

// ─────────────────────────────────────────────
// Rute publice (nu necesită login)
// ─────────────────────────────────────────────
router.get("/",    getAllQuestions);    // GET  /api/questions
router.get("/:id", getQuestionById);   // GET  /api/questions/:id

// ─────────────────────────────────────────────
// Rute protejate (necesită JWT valid)
// ─────────────────────────────────────────────
router.post("/",     protect, createQuestion);   // POST   /api/questions
router.put("/:id",   protect, updateQuestion);   // PUT    /api/questions/:id
router.delete("/:id", protect, deleteQuestion);  // DELETE /api/questions/:id

module.exports = router;