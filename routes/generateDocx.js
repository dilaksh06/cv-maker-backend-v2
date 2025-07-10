import ejs from "ejs";
import express from "express";
import htmlDocx from "html-docx-js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.post("/docx", async (req, res) => {
    try {
        const { templateId, ...cvData } = req.body;

        if (!templateId) {
            return res.status(400).send("Missing templateId");
        }

        const templatePath = path.join(__dirname, "../templates", `${templateId}.ejs`);

        // Render HTML from EJS
        const html = await ejs.renderFile(templatePath, cvData, { async: true });

        // Convert HTML to a DOCX buffer
        const docxBuffer = htmlDocx.asBlob(html);

        // Send DOCX as file
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.setHeader("Content-Disposition", `attachment; filename="${templateId}.docx"`);
        res.send(docxBuffer);
    } catch (err) {
        console.error("DOCX generation failed:", err);
        res.status(500).send("DOCX generation failed");
    }
});

export default router;
