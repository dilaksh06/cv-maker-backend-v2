import express from "express";
import generateHTML from "../utils/htmlGenerator.js"; // new function for preview
import generatePDF from "../utils/pdfGenerator.js";

const router = express.Router();

// PDF download route
router.post("/pdf", async (req, res) => {
    try {
        const pdf = await generatePDF(req.body);
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=cv.pdf",
        });
        res.send(pdf);
    } catch (err) {
        console.error("PDF Generation Error:", err);
        res.status(500).send("Failed to generate PDF");
    }
});



router.post("/html", async (req, res) => {
    try {
        const html = await generateHTML(req.body);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.send(html);
    } catch (err) {
        console.error("HTML Preview Error:", err);
        res.status(500).send("Failed to render HTML");
    }
});


export default router;
