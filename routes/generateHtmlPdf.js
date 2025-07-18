// backend/routes/generateHtmlPdf.js
import express from "express";
import puppeteer from "puppeteer";
// If you need to write debug files, uncomment the next line:
// import fs from "fs";

const router = express.Router();

router.post("/", async (req, res) => {
  // Extract both html and filename from the request body.
  // We're destructuring `filename` and providing a default if it's not sent,
  // ensuring the downloaded file has a meaningful name.
  const { html, filename = "resume.pdf" } = req.body;

  if (!html) {
    return res.status(400).send("Missing HTML content.");
  }

  let browser; // Declare browser outside try-catch to ensure it's closed in finally block.
  try {
    // 🚀 Launch Puppeteer: The headless browser that converts HTML to PDF.
    browser = await puppeteer.launch({
      headless: "new", // Use "new" for the latest headless mode. 'true' is deprecated.
      // Recommended arguments for stable operation in various environments (especially Docker/Linux).
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      // Optional: Uncomment for debugging if you want to see the browser window
      // headless: false,
    });

    const page = await browser.newPage();

    // 📄 Set HTML content and wait for it to render.
    // `waitUntil: "networkidle0"` waits until there are no more than 0 network connections
    // for at least 500ms, ensuring all resources (like fonts) are loaded.
    // `timeout: 60000` (1 minute) provides ample time for potentially large content.
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 60000 });

    // 🎨 Emulate screen media type.
    // This is crucial because your CSS is likely written for 'screen' media.
    // Puppeteer's default for `page.pdf` might be 'print', which can alter styles.
    await page.emulateMediaType("screen");

    // Optional: For debugging, save the HTML that Puppeteer processes
    // fs.writeFileSync('debug_puppeteer_input.html', html);

    // 📥 Generate the PDF. This is where most of the PDF rendering control happens.
    const pdfBuffer = await page.pdf({
      format: "A4", // Set the paper format explicitly to A4.
      printBackground: true, // Absolutely ESSENTIAL for backgrounds (like your sidebar color)
                             // and images to be rendered in the PDF.
      margin: {
        // 🚨 CRITICAL CHANGE: Setting all margins to 0.
        // This will make the PDF content extend to the very edges of the A4 page.
        // Ensure your CSS has adequate internal padding on .cv-container, .cv-sidebar, .cv-main
        // if you want any whitespace between your content and the page edge.
        top: "5mm",
        right: "5mm",
        bottom: "5mm",
        left: "5mm",
      },
      // IMPORTANT: Set preferCSSPageSize to false.
      // Since we are setting explicit margins here, we don't want Puppeteer
      // to also consider any @page rules from your CSS, which could lead to conflicts
      // or unexpected spacing.
      preferCSSPageSize: false,

      // Optional: For debugging, save the output PDF to a file on your server
      // path: "debug-generated-resume.pdf",
    });

    // ✨ Close the browser instance to free up resources.
    await browser.close();

    // ⬇️ Send the generated PDF back to the client.
    res.setHeader("Content-Type", "application/pdf");
    // Set the Content-Disposition header with the dynamic and sanitized filename.
    // `replace(/\s+/g, '_')` replaces spaces with underscores for cleaner filenames.
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename.replace(/\s+/g, '_')}"`
    );
    res.send(pdfBuffer); // Send the actual PDF binary data.

  } catch (err) {
    console.error("Failed to generate PDF:", err);
    // Send a user-friendly error message without exposing sensitive server details.
    res.status(500).send(`Error generating PDF: ${err.message || "Unknown error"}`);
    // You can log the full error for your own debugging: console.error(err);
  } finally {
    // Ensure the browser is closed even if an error occurs during PDF generation
    // to prevent memory leaks and orphaned Chromium processes.
    if (browser) {
      await browser.close();
    }
  }
});

export default router;