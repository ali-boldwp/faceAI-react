const mongoose = require('mongoose');

const AiSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  files: [
    {
      fileName: String,
      filePath: String, 
    }
  ],
  response: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ai', AiSchema);
