import ejs from "ejs";
import express from "express";
import path, { dirname } from "path";
import puppeteer from "puppeteer";
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.post("/", async (req, res) => {
    try {
        const { templateId, asHtml, ...cvData } = req.body;

        if (!templateId) {
            return res.status(400).send("Missing templateId");
        }

        const templatePath = path.join(__dirname, "../templates", `${templateId}.ejs`);

        // Render EJS to HTML
        const html = await ejs.renderFile(templatePath, cvData);

        if (asHtml) {
            // For preview request → return raw HTML
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            return res.send(html);
        }

        // For PDF request → render HTML to PDF using Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: "networkidle0" });

       const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
        top: "5mm",
        bottom: "5mm",
        left: "5mm",
        right: "5mm",
    },
});

        await browser.close();

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=cv.pdf",
        });

        res.send(pdfBuffer);
    } catch (err) {
        console.error("CV Generation Error:", err);
        res.status(500).send("Failed to generate CV");
    }
});

export default router;
