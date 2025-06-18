import express from "express";
import generatePDF from "../utils/pdfGenerator.js"; // Add `.js` extension for ES Modules

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        console.log("Received data from frontend:", req.body);
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

export default router;
