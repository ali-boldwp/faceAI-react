const express = require("express");
const router = express.Router();
const FaceProfile = require("../models/FaceProfile");

// ✅ POST — Save Image URLs + Questions + Title
router.post("/", async (req, res) => {
    try {
        const { title, images, questions } = req.body;

        if (!title) return res.status(400).json({ message: "Title is required." });
        if (!images || !images.length)
            return res.status(400).json({ message: "Images are required." });
        if (!questions || !Array.isArray(questions))
            return res.status(400).json({ message: "Questions must be an array." });

        const faceProfile = new FaceProfile({ title, images, questions });
        await faceProfile.save();

        res.status(201).json({
            success: true,
            message: "Data saved successfully!",
            data: faceProfile,
        });
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});

// ✅ GET — Fetch All Records (sorted newest first)
router.get("/", async (req, res) => {
    try {
        const profiles = await FaceProfile.find().sort({ createdAt: -1 });

        // Return only what you need — title, createdAt, etc.
        const formatted = profiles.map((p) => ({
            _id: p._id,
            title: p.title,
            createdAt: p.createdAt,
            questions: p.questions,
            images: p.images,
        }));

        res.json({ success: true, data: formatted });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});


// ✅ GET — Fetch Single Record by ID
router.get("/:id", async (req, res) => {
    try {
        const profile = await FaceProfile.findById(req.params.id);

        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        res.json({
            success: true,
            data: profile,
        });
    } catch (error) {
        console.error("Error fetching profile by ID:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


module.exports = router;
