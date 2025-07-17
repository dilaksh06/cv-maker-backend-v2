// backend/routes/generateHtmlPdf.js
import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();

router.post("/", async (req, res) => {
  // Extract both html and filename from the request body
  const { html, filename = "resume.pdf" } = req.body; // 🎯 FIX: Destructure filename, provide a default

  if (!html) {
    return res.status(400).send("Missing HTML content.");
  }

  let browser; // Declare browser outside try-catch for finally block access
  try {
    browser = await puppeteer.launch({
      headless: "new", // Use "new" for the new Headless mode. 'true' is deprecated.
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      // Optional: If you're on a Linux server without a bundled Chromium,
      // you might need to specify the executablePath:
      // executablePath: '/usr/bin/google-chrome-stable',
    });

    const page = await browser.newPage();
    // Ensure sufficient timeout for large content or slow networks
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 60000 });
    await page.emulateMediaType("screen"); // Apply screen styles for PDF generation

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // Essential for background colors/images from your CSS
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
      // You can add 'path: "output.pdf"' here for debugging purposes
      // to see if the PDF is generated correctly on the server-side.
    });

    await browser.close();

    // Set the Content-Type header to application/pdf
    res.setHeader("Content-Type", "application/pdf");
    // Set the Content-Disposition header with the dynamic filename
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename.replace(/\s+/g, '_')}"` // 🎯 FIX: Use dynamic filename and sanitize it
    );
    // Send the generated PDF buffer
    res.send(pdfBuffer);
  } catch (err) {
    console.error("Failed to generate PDF:", err);
    // Provide a more informative error message
    res.status(500).send(`Error generating PDF: ${err.message || err}`);
  } finally {
    if (browser) {
      await browser.close(); // Ensure browser is closed even if errors occur
    }
  }
});

export default router;