<<<<<<< HEAD
<<<<<<< HEAD
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
=======
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
>>>>>>> dec84a2660a987751f51d3f7ee1d057e0d5b92b9
=======
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
>>>>>>> c885b105198062ca564ffe44700f7984fdcbcfab
