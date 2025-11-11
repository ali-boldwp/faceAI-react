<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const { randomBytes } = require('crypto');
const axios = require('axios');

const Ai = require('../models/Ai');

const upload = multer({ dest: 'temp/' }).fields([
    { name: "file", maxCount: 10 },
    { name: "image", maxCount: 10 }
]);


async function extractPdfText(filePath) {
    const pdfjsLib = await import("pdfjs-dist/build/pdf.js");
    const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.js");
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

    const data = new Uint8Array(fs.readFileSync(filePath));
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + "\n";
    }
    return text;
}

async function readFileText(filePath, mime) {
    if (mime === "application/pdf") return await extractPdfText(filePath);
    if (mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const data = await mammoth.extractRawText({ path: filePath });
        return data.value;
    }
    if (mime.startsWith("text/")) return fs.readFileSync(filePath, "utf8");


    const buffer = fs.readFileSync(filePath);
    return `BASE64:${buffer.toString("base64")}`;
}

function generateTempFilename(originalName) {
    const ext = path.extname(originalName);
    const base = path.basename(originalName, ext);
    const random = randomBytes(8).toString('hex');
    return `${base}-${random}${ext}`;
}


router.post('/', upload, async (req, res) => {
    const tempFiles = [];
    try {
        const prompt = req.body.prompt || "";
        const mode = req.body.mode || "chat";

        let finalPrompt = "";

        if (mode === "chat") {
            if (!prompt) return res.status(400).json({ error: "Prompt required" });
            finalPrompt = prompt;

        } else if (mode === "file" || mode === "deep") {
            const uploadedFiles = req.files?.file || [];
            if (!uploadedFiles.length) return res.status(400).json({ error: "File(s) required" });

            let filesText = "";
            for (const file of uploadedFiles) {
                const tempPath = path.join('temp', generateTempFilename(file.originalname));
                fs.renameSync(file.path, tempPath);
                tempFiles.push(tempPath);

                const text = await readFileText(tempPath, file.mimetype);
                filesText += `File (${file.mimetype}) content for ${file.originalname}:\n"""${text}"""\n\n`;
            }

            finalPrompt = mode === "deep"
                ? `You are an expert research assistant.\nUser prompt: "${prompt}"\nDocument content:\n${filesText}`
                : filesText;


            if (mode === "deep") {
                const uploadedImages = req.files?.image || [];
                for (const image of uploadedImages) {
                    const imagePath = path.join('temp', generateTempFilename(image.originalname));
                    fs.renameSync(image.path, imagePath);
                    tempFiles.push(imagePath);

                    const imageBuffer = fs.readFileSync(imagePath);
                    const base64Image = imageBuffer.toString('base64');
                    finalPrompt += `\nUser uploaded an image (base64) for ${image.originalname}: ${base64Image}`;
                }
            }
        } else {
            return res.status(400).json({ error: "Invalid mode" });
        }


        const aiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: process.env.OPENAI_MODEL || "gpt-4o-mini",
                messages: [{ role: "user", content: finalPrompt }],
                max_tokens: 2000,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const aiText = aiResponse.data.choices?.[0]?.message?.content || "No response";


        const allFiles = [
            ...(req.files?.file || []).map(f => ({ fileName: f.originalname, filePath: f.path })),
            ...(req.files?.image || []).map(f => ({ fileName: f.originalname, filePath: f.path }))
        ];

        const record = await Ai.create({
            prompt,
            files: allFiles,
            response: aiText
        });

        res.status(201).json({ message: "AI record saved successfully", data: record });

    } catch (err) {
        console.error("API Error:", err);
        res.status(500).json({ error: err.message });
    } finally {
        tempFiles.forEach(f => { if (fs.existsSync(f)) fs.unlinkSync(f); });
    }
});


router.get('/', async (req, res) => {
    try {
        const records = await Ai.find().sort({ createdAt: -1 });
        res.json(records);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch records" });
    }
});

module.exports = router;
=======
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const { randomBytes } = require('crypto');
const axios = require('axios');

const Ai = require('../models/Ai');

const upload = multer({ dest: 'temp/' }).fields([
    { name: "file", maxCount: 10 },
    { name: "image", maxCount: 10 }
]);


async function extractPdfText(filePath) {
    const pdfjsLib = await import("pdfjs-dist/build/pdf.js");
    const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.js");
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

    const data = new Uint8Array(fs.readFileSync(filePath));
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + "\n";
    }
    return text;
}

async function readFileText(filePath, mime) {
    if (mime === "application/pdf") return await extractPdfText(filePath);
    if (mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const data = await mammoth.extractRawText({ path: filePath });
        return data.value;
    }
    if (mime.startsWith("text/")) return fs.readFileSync(filePath, "utf8");


    const buffer = fs.readFileSync(filePath);
    return `BASE64:${buffer.toString("base64")}`;
}

function generateTempFilename(originalName) {
    const ext = path.extname(originalName);
    const base = path.basename(originalName, ext);
    const random = randomBytes(8).toString('hex');
    return `${base}-${random}${ext}`;
}


router.post('/', upload, async (req, res) => {
    const tempFiles = [];
    try {
        const prompt = req.body.prompt || "";
        const mode = req.body.mode || "chat";

        let finalPrompt = "";

        if (mode === "chat") {
            if (!prompt) return res.status(400).json({ error: "Prompt required" });
            finalPrompt = prompt;

        } else if (mode === "file" || mode === "deep") {
            const uploadedFiles = req.files?.file || [];
            if (!uploadedFiles.length) return res.status(400).json({ error: "File(s) required" });

            let filesText = "";
            for (const file of uploadedFiles) {
                const tempPath = path.join('temp', generateTempFilename(file.originalname));
                fs.renameSync(file.path, tempPath);
                tempFiles.push(tempPath);

                const text = await readFileText(tempPath, file.mimetype);
                filesText += `File (${file.mimetype}) content for ${file.originalname}:\n"""${text}"""\n\n`;
            }

            finalPrompt = mode === "deep"
                ? `You are an expert research assistant.\nUser prompt: "${prompt}"\nDocument content:\n${filesText}`
                : filesText;


            if (mode === "deep") {
                const uploadedImages = req.files?.image || [];
                for (const image of uploadedImages) {
                    const imagePath = path.join('temp', generateTempFilename(image.originalname));
                    fs.renameSync(image.path, imagePath);
                    tempFiles.push(imagePath);

                    const imageBuffer = fs.readFileSync(imagePath);
                    const base64Image = imageBuffer.toString('base64');
                    finalPrompt += `\nUser uploaded an image (base64) for ${image.originalname}: ${base64Image}`;
                }
            }
        } else {
            return res.status(400).json({ error: "Invalid mode" });
        }


        const aiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: process.env.OPENAI_MODEL || "gpt-4o-mini",
                messages: [{ role: "user", content: finalPrompt }],
                max_tokens: 2000,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const aiText = aiResponse.data.choices?.[0]?.message?.content || "No response";


        const allFiles = [
            ...(req.files?.file || []).map(f => ({ fileName: f.originalname, filePath: f.path })),
            ...(req.files?.image || []).map(f => ({ fileName: f.originalname, filePath: f.path }))
        ];

        const record = await Ai.create({
            prompt,
            files: allFiles,
            response: aiText
        });

        res.status(201).json({ message: "AI record saved successfully", data: record });

    } catch (err) {
        console.error("API Error:", err);
        res.status(500).json({ error: err.message });
    } finally {
        tempFiles.forEach(f => { if (fs.existsSync(f)) fs.unlinkSync(f); });
    }
});


router.get('/', async (req, res) => {
    try {
        const records = await Ai.find().sort({ createdAt: -1 });
        res.json(records);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch records" });
    }
});

module.exports = router;
>>>>>>> dec84a2660a987751f51d3f7ee1d057e0d5b92b9
