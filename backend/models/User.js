<<<<<<< HEAD
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
=======
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
>>>>>>> dec84a2660a987751f51d3f7ee1d057e0d5b92b9
