const express = require("express");
const router = express.Router();
const FaceProfile = require("../models/FaceProfile");
const traits = require("./traits.json")
const axios = require('axios');
<<<<<<< HEAD


router.post("/", async (req, res) => {
    try {
        const { title, images, questions } = req.body;
=======
const authMiddleware = require("../middleware/authMiddleware")


router.post("/",authMiddleware, async (req, res) => {
    try {
        const { title, images, questions } = req.body;
                const userId = req.user.id
                        console.log(":userI",userId)
>>>>>>> dec84a2660a987751f51d3f7ee1d057e0d5b92b9

        if (!title) return res.status(400).json({ message: "Title is required." });
        if (!images || !images.length)
            return res.status(400).json({ message: "Images are required." });
        if (!questions || !Array.isArray(questions))
            return res.status(400).json({ message: "Questions must be an array." });

        // Enrich questions with traits
        const enrichedQuestions = questions.map((q) => {
<<<<<<< HEAD
=======
            const answers = Array.isArray(q.answer) ? q.answer : [q.answer];
>>>>>>> dec84a2660a987751f51d3f7ee1d057e0d5b92b9
            let matchedTrait = null;

            for (const [section, traitList] of Object.entries(traits)) {
                matchedTrait = traitList.find((trait) => {
<<<<<<< HEAD
                    const answer = q.answer.toLowerCase().trim();
                    const shape = (trait.shape || "").toLowerCase().trim();
                    const name = (trait.name || "").toLowerCase().trim();
                    return answer.includes(shape) || answer.includes(name);
=======
                    return answers.some((ans) => {
                        const answer = ans.toLowerCase().trim();
                        const shape = (trait.shape || "").toLowerCase().trim();
                        const name = (trait.name || "").toLowerCase().trim();
                        return answer.includes(shape) || answer.includes(name);
                    });
>>>>>>> dec84a2660a987751f51d3f7ee1d057e0d5b92b9
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

<<<<<<< HEAD
=======

>>>>>>> dec84a2660a987751f51d3f7ee1d057e0d5b92b9
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

### Step 5: Output Format — HTML body with inline CSS
Return **only** the HTML <body> fragment (do not include <html>, <head>, or any surrounding text). The <body> should use inline CSS on all elements (no external or internal <style> blocks). Structure the body with clear semantic sections and headings that correspond to Steps 1–4. Example sections: <section id="summary">, <section id="ideal-comparison">, <section id="harmony-scores">, <section id="personality-analysis">.  

Within the <section id="harmony-scores">, include a compact visual representation of the numeric scores (for example, labeled bars using <div> elements with inline width styles representing percentage). Also include a small JSON block displayed in a <pre> or <code> element showing the numeric scores and computed overall index (the JSON must match the numeric values shown visually).  

All text must be human-readable, well-formatted, and accessible (use headings <h1>–<h3> as appropriate, paragraphs <p>, and lists <ul>/<li> where helpful). Use inline CSS for typography, spacing, borders, and the score bars. Keep the body self-contained and no scripts.

Important: Do not output any additional debugging, commentary, or metadata. The response must be a single HTML <body> fragment that contains the complete analysis.

---

Below is the user’s extracted face data (in JSON format):
\${JSON.stringify(enrichedQuestions, null, 2)}

Please respond ONLY with the final HTML <body> fragment containing the analysis, using inline CSS as described above.
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

        let aiPersonality =
            aiResponse?.data?.choices?.[0]?.message?.content?.trim() ||
            "No analysis generated.";

            aiPersonality = aiPersonality
  .replace(/```html|```/gi, "") // remove markdown code block wrappers
  .replace(/<\/?(html|head|body)>/gi, "") // remove <html>, <head>, <body> tags
  .trim();

        const faceProfile = new FaceProfile({
<<<<<<< HEAD
=======
            userId: userId,
>>>>>>> dec84a2660a987751f51d3f7ee1d057e0d5b92b9
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



<<<<<<< HEAD
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
=======
router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;


        const profiles = await FaceProfile.find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        // Format response for clean frontend use
        const formatted = profiles.map((p) => ({
            _id: p._id,
            title: p.title,
            images: p.images,
            questions: p.questions.map((q) => ({
                question: q.question,
                answer: q.answer,
            })),
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));

        res.status(200).json({
            success: true,
            message: "Profiles fetched successfully!",
            count: formatted.length,
            data: formatted,
        });
    } catch (error) {
        console.error("Error fetching face profiles:", error);
        res
            .status(500)
            .json({ success: false, message: "Server error while fetching profiles." });
>>>>>>> dec84a2660a987751f51d3f7ee1d057e0d5b92b9
    }
});


<<<<<<< HEAD
=======

>>>>>>> dec84a2660a987751f51d3f7ee1d057e0d5b92b9
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

router.delete("/:id", async (req, res) => {
    try {
        const profile = await FaceProfile.findByIdAndDelete(req.params.id);
        if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

        res.json({ success: true, message: "Profile deleted successfully", data: profile._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


module.exports = router;
