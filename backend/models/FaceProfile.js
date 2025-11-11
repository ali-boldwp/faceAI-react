const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
      answer: [{ type: String, required: true }],
  },
  { _id: false } 
);

const FaceProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    title: { type: String, required: true },
    images: [{ type: String, required: true }],
    aiPersonality: {
      type: String,
      default: null,
    },
    questions: [QuestionSchema],
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("FaceProfile", FaceProfileSchema);
