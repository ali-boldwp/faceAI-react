require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.log("❌ Mongo Error:", err.message));


const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const aiRoutes = require('./routes/Ai');
app.use('/api/ai', aiRoutes);


app.get("/", (req, res) => {
    res.send("Server running successfully 🔥");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
