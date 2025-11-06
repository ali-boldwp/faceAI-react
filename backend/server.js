require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

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

const faceProfileRoutes = require("./routes/faceProfileRoutes");
app.use("/api/face-profiles", faceProfileRoutes);


app.get("/api/", (req, res) => {
    res.send("Server running successfully 🔥");
});

// --- Static build (copied at image build time to /app/public) ---
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir, { index: "index.html", maxAge: "1h" }));

// --- SPA fallback (after API & static) ---
// after your API + static middleware
app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




