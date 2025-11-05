const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
});

const FaceProfileSchema = new mongoose.Schema({
    title: { type: String, required: true }, // 👈 added title
    images: [{ type: String, required: true }],
    questions: [QuestionSchema],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FaceProfile", FaceProfileSchema);
