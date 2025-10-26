import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";

// ✅ Correct import — make sure you're using this!
import htmlToDocx from "html-to-docx";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.post("/", async (req, res) => {
  try {
    const { html, filename = "cv.docx" } = req.body;

    if (!html) {
      return res.status(400).send("Missing HTML content for DOCX generation");
    }

    const docxBuffer = await htmlToDocx(html, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });

    res.set({
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename=${filename}`,
    });

    res.send(docxBuffer);
  } catch (err) {
    console.error("Error converting HTML to DOCX:", err);
    res.status(500).send("Failed to generate DOCX file");
  }
});

export default router;
