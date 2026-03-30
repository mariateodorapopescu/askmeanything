// api/models/Article.js
// Model pentru Articole stil revistă
// Are cover image mare, subtitle, și corp lung cu posibil markdown

const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    // Subtitlul / excerptul — apare sub titlu, înainte de cover image
    subtitle: {
      type: String,
      trim: true,
      maxlength: [300, "Subtitle cannot exceed 300 characters"],
      default: "",
    },

    // URL-ul imaginii de cover — se afișează ca banner mare sus
    coverImage: {
      type: String,
      trim: true,
      default: "",
      // Validare simplă că e un URL (nu obligatoriu)
      validate: {
        validator: function (v) {
          if (!v) return true; // câmp opțional, dacă e gol e OK
          return /^https?:\/\/.+/.test(v);
        },
        message: "coverImage must be a valid URL (http/https)",
      },
    },

    // Corpul articolului — text lung, poate conține markdown
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // Slug pentru URL frumos — ex: "on-learning-to-disappear"
    // Îl generăm automat din titlu dacă nu e furnizat
    slug: {
      type: String,
      unique: true,
      sparse: true,   // sparse: true permite mai multe documente cu slug null
    },

    views: {
      type: Number,
      default: 0,
    },

    // Dacă articolul e publicat sau draft
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generează slug automat din titlu înainte de salvare
// "On Learning to Disappear" → "on-learning-to-disappear-1700000000000"
ArticleSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")   // scoate caracterele speciale
        .replace(/\s+/g, "-")            // înlocuiește spațiile cu -
        .replace(/-+/g, "-")             // elimină - duble
        .slice(0, 80)                    // maxim 80 caractere
      + "-" + Date.now();                // adaugă timestamp pentru unicitate
  }
  next();
});

ArticleSchema.index({ tags: 1 });
ArticleSchema.index({ title: "text", content: "text" });
ArticleSchema.index({ slug: 1 });

module.exports = mongoose.model("Article", ArticleSchema);