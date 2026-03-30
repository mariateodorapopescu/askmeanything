// api/models/BlogPost.js
// Model pentru postări de blog personal
// Conținut casual cu imagini înglobate în text cu sintaxă ![alt](url)

const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    // Corpul postării — text liber cu imagini embedded markdown
    // Exemplu: "Am mers azi la piață.\n\n![Piața](https://...)\n\nEra frumos."
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },

    // Cover image — prima imagine pe care o vede cititorul
    coverImage: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^https?:\/\/.+/.test(v);
        },
        message: "coverImage must be a valid URL",
      },
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

    views: {
      type: Number,
      default: 0,
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

BlogPostSchema.index({ tags: 1 });
BlogPostSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("BlogPost", BlogPostSchema);