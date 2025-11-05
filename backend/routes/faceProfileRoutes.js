const express = require("express");
const router = express.Router();
const FaceProfile = require("../models/FaceProfile");
const traits = require("./traits.json")
const axios = require('axios');


router.post("/", async (req, res) => {
    try {
        const { title, images, questions } = req.body;

        if (!title) return res.status(400).json({ message: "Title is required." });
        if (!images || !images.length)
            return res.status(400).json({ message: "Images are required." });
        if (!questions || !Array.isArray(questions))
            return res.status(400).json({ message: "Questions must be an array." });

        // Enrich questions with traits
        const enrichedQuestions = questions.map((q) => {
            let matchedTrait = null;

            for (const [section, traitList] of Object.entries(traits)) {
                matchedTrait = traitList.find((trait) => {
                    const answer = q.answer.toLowerCase().trim();
                    const shape = (trait.shape || "").toLowerCase().trim();
                    const name = (trait.name || "").toLowerCase().trim();
                    return answer.includes(shape) || answer.includes(name);
                });
                if (matchedTrait) break;
            }

            return {
                ...q,
                traitDetails: matchedTrait
                    ? {
                        ...(matchedTrait.shape && { shape: matchedTrait.shape }),
                        ...(matchedTrait.name && { name: matchedTrait.name }),
                        measurements: matchedTrait.measurements || null,
                        personality: matchedTrait.personality || null,
                    }
                    : null,
            };
        });

        // Create AI prompt
        const finalPrompt = `
You are a professional facial morphology and personality analysis expert.
I will provide detailed face attributes (eyes, nose, lips, jawline, etc.) extracted from an AI face analysis system.

Your task:
Perform a detailed face reading and measurement-style personality analysis based on the given data.
Follow these steps and structure the output accordingly:

---

### Step 1: Morphological Feature Summary
Summarize each facial feature (eyes, eyebrows, nose, lips, jawline, chin, forehead, etc.) in clear descriptive language.
Mention what each feature generally signifies in face reading (based on morphology principles).

### Step 2: Ideal Face Comparison (Golden Ratio φ = 1.618)
Explain how the person’s features compare to the “ideal proportions” of the golden ratio face.
You can reference general proportional balance, symmetry, and feature harmony.
If possible, mention estimated deviations or general harmony quality (e.g. “Slightly wider jaw than ideal”, “Balanced eye spacing”).

### Step 3: Harmony & Section Scoring
Provide a harmony score (0–100) for each facial region:
- Face Shape
- Eyes & Brows
- Nose
- Mouth
- Chin & Jawline

Then calculate an overall “Facial Harmony Index” (weighted average):
• Face shape – 30%
• Eyes & brows – 25%
• Nose – 20%
• Mouth – 15%
• Chin & jawline – 10%

### Step 4: Psychological & Personality Interpretation
Based on morphology and proportional analysis, describe what kind of personality traits this face reflects.
Include behavioral tendencies, emotional nature, confidence level, leadership or sensitivity traits, etc.

### Step 5: Output Format
Return a clean, structured JSON response:
{
  "summary": "...",
  "ideal_comparison": "...",
  "harmony_scores": {
    "face_shape": 92,
    "eyes_brows": 88,
    "nose": 84,
    "mouth": 90,
    "chin_jawline": 86,
    "overall_harmony_index": 88
  },
  "personality_analysis": "..."
}

---

Below is the user’s extracted face data (in JSON format):
${JSON.stringify(enrichedQuestions, null, 2)}

Please respond ONLY with the final structured analysis as described above.
`;


        const aiResponse = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: process.env.OPENAI_MODEL || "gpt-4o-mini",
                messages: [{ role: "user", content: finalPrompt }],
                max_tokens: 2000,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const aiPersonality =
            aiResponse?.data?.choices?.[0]?.message?.content?.trim() ||
            "No analysis generated.";

        const faceProfile = new FaceProfile({
            title,
            images,
            questions: enrichedQuestions,
            aiPersonality,
        });

        await faceProfile.save();

        const responseProfile = faceProfile.toObject();

        res.status(201).json({
            success: true,
            message: "Data saved successfully!",
            data: responseProfile,
        });
    } catch (error) {
        console.error("Error saving data:", error?.response?.data || error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});



router.get("/", async (req, res) => {
    try {
        const profiles = await FaceProfile.find().sort({ createdAt: -1 });

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
