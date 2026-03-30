// api/controllers/blogpost.controller.js
// Logica pentru Blog Posts personale

const BlogPost = require("../models/BlogPost");

// ─────────────────────────────────────────────
// GET /api/blogposts
// ─────────────────────────────────────────────
const getAllBlogPosts = async (req, res) => {
  try {
    const filter = { published: true };
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }

    const posts = await BlogPost.find(filter)
      .sort({ createdAt: -1 })
      .select("title coverImage tags createdAt views")  // fără content în listă
      .lean();

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/blogposts/:id
// ─────────────────────────────────────────────
const getBlogPostById = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).select("-__v").lean();

    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid blog post ID" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// POST /api/blogposts
// ─────────────────────────────────────────────
const createBlogPost = async (req, res) => {
  try {
    const { title, content, coverImage, tags, published } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!content?.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = await BlogPost.create({
      title:      title.trim(),
      content:    content.trim(),
      coverImage: coverImage?.trim() || "",
      tags:       Array.isArray(tags) ? tags : [],
      author:     req.user?._id,
      published:  published !== undefined ? published : true,
    });

    res.status(201).json(post);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// PUT /api/blogposts/:id
// (folosit de edit_blogpost.tsx)
// ─────────────────────────────────────────────
const updateBlogPost = async (req, res) => {
  try {
    const { title, content, coverImage, tags, published } = req.body;

    const updateData = {};
    if (title      !== undefined) updateData.title      = title.trim();
    if (content    !== undefined) updateData.content    = content.trim();
    if (coverImage !== undefined) updateData.coverImage = coverImage.trim();
    if (tags       !== undefined) updateData.tags       = Array.isArray(tags) ? tags : [];
    if (published  !== undefined) updateData.published  = published;

    const updated = await BlogPost.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid blog post ID" });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/blogposts/:id
// ─────────────────────────────────────────────
const deleteBlogPost = async (req, res) => {
  try {
    const deleted = await BlogPost.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json({ message: "Blog post deleted successfully", id: req.params.id });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid blog post ID" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
};