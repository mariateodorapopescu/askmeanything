// api/controllers/article.controller.js
// Logica pentru Articole stil revistă

const Article = require("../models/Article");

// ─────────────────────────────────────────────
// GET /api/articles
// ─────────────────────────────────────────────
const getAllArticles = async (req, res) => {
  try {
    const filter = { published: true };
    // Filtrare opțională după tag: GET /api/articles?tag=wellness
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }

    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      // În listă nu trimiți content complet (poate fi enorm) — doar metadate
      .select("title subtitle coverImage tags createdAt slug views")
      .lean();

    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/articles/:id
// ─────────────────────────────────────────────
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).select("-__v").lean();

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json(article);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid article ID" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// POST /api/articles
// ─────────────────────────────────────────────
const createArticle = async (req, res) => {
  try {
    const { title, subtitle, coverImage, content, tags, published } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!content?.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    const article = await Article.create({
      title:      title.trim(),
      subtitle:   subtitle?.trim()    || "",
      coverImage: coverImage?.trim()  || "",
      content:    content.trim(),
      tags:       Array.isArray(tags) ? tags : [],
      author:     req.user?._id,
      published:  published !== undefined ? published : true,
    });

    res.status(201).json(article);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// PUT /api/articles/:id
// (folosit de edit_post.tsx)
// ─────────────────────────────────────────────
const updateArticle = async (req, res) => {
  try {
    const { title, subtitle, coverImage, content, tags, published } = req.body;

    const updateData = {};
    if (title      !== undefined) updateData.title      = title.trim();
    if (subtitle   !== undefined) updateData.subtitle   = subtitle.trim();
    if (coverImage !== undefined) updateData.coverImage = coverImage.trim();
    if (content    !== undefined) updateData.content    = content.trim();
    if (tags       !== undefined) updateData.tags       = Array.isArray(tags) ? tags : [];
    if (published  !== undefined) updateData.published  = published;

    const updated = await Article.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid article ID" });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/articles/:id
// ─────────────────────────────────────────────
const deleteArticle = async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({ message: "Article deleted successfully", id: req.params.id });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid article ID" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};