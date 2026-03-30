// api/models/Question.js
// Model pentru Întrebări Anonime
// Întrebarea devine titlul, răspunsul e corpul articolului

const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    // Titlul postării — întrebarea trimisă anonim
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,           // elimină spațiile de la început/sfârșit automat
      maxlength: [300, "Question cannot exceed 300 characters"],
    },

    // Corpul articolului — răspunsul lung
    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
    },

    // Array de tag-uri, ex: ["motivation", "career"]
    tags: {
      type: [String],
      default: [],
    },

    // Câmpul author nu e afișat vizitatorilor (e anonymous),
    // dar îl păstrăm intern ca referință spre User
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",          // face legătura cu modelul User existent
      required: false,      // poate fi null dacă vrei să permiți și non-autentificați
    },

    // Numărul de vizualizări — util pentru statistici
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    // timestamps: true îi spune lui Mongoose să adauge automat
    // câmpurile createdAt și updatedAt — nu trebuie să le scrii manual
    timestamps: true,
  }
);

// Index pe tags — face căutările după tag rapid
// (util când ai multe întrebări și filtrezi după categorie)
QuestionSchema.index({ tags: 1 });

// Index text pe question și answer — permite full-text search
// ex: Question.find({ $text: { $search: "motivation" } })
QuestionSchema.index({ question: "text", answer: "text" });

module.exports = mongoose.model("Question", QuestionSchema);