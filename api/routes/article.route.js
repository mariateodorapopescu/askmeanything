// api/routes/article.route.js

const express = require("express");
const router  = express.Router();

const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/article.controller");

const { protect } = require("../middleware/auth");

// Publice
router.get("/",    getAllArticles);
router.get("/:id", getArticleById);

// Protejate
router.post("/",      protect, createArticle);
router.put("/:id",    protect, updateArticle);
router.delete("/:id", protect, deleteArticle);

module.exports = router;