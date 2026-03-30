// api/routes/blogpost.route.js

const express = require("express");
const router  = express.Router();

const {
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require("../controllers/blogpost.controller");

const { protect } = require("../middleware/auth");

// Publice
router.get("/",    getAllBlogPosts);
router.get("/:id", getBlogPostById);

// Protejate
router.post("/",      protect, createBlogPost);
router.put("/:id",    protect, updateBlogPost);
router.delete("/:id", protect, deleteBlogPost);

module.exports = router;