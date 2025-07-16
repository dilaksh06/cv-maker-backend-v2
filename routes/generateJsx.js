import express from "express";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import React from "react";
import ReactDOMServer from "react-dom/server";

const router = express.Router();

const jsxTemplateMap = {
  "template-jsx-modern-elegant": {
    componentPath: "../templates/classic/modern-elegant/ModernElegant.jsx",
    cssPath: "../templates/classic/modern-elegant/modern-elegant.css",
  },
  "template-jsx-clean-white": {
    componentPath: "../templates/clean/clean-white/CleanWhite.jsx",
    cssPath: "../templates/clean/clean-white/clean-white.css",
  },
  // ✅ Add more here as you add templates
};

router.post("/", async (req, res) => {
  const { templateId, asHtml = false, ...cvData } = req.body;

  if (!templateId || !jsxTemplateMap[templateId]) {
    return res.status(400).json({ error: "Invalid or missing templateId" });
  }

  try {
    const { componentPath, cssPath } = jsxTemplateMap[templateId];

    // Dynamically import the JSX component
    const modulePath = path.resolve(path.join("templates", componentPath));
    const TemplateComponent = (await import(modulePath)).default;

    // Render JSX to static HTML
    const htmlBody = ReactDOMServer.renderToStaticMarkup(
      React.createElement(TemplateComponent, cvData)
    );

    // Load CSS if exists
    const cssFilePath = path.resolve(path.join("templates", cssPath));
    const css = fs.existsSync(cssFilePath)
      ? fs.readFileSync(cssFilePath, "utf-8")
      : "";

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${css}</style>
        </head>
        <body>${htmlBody}</body>
      </html>
    `;

    if (asHtml) {
      // 📄 Return raw HTML (for preview)
      return res.send(fullHtml);
    } else {
      // 🧾 Generate PDF from HTML using Puppeteer
      const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      await page.setContent(fullHtml, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
      await browser.close();

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${templateId}.pdf"`,
      });
      res.send(pdfBuffer);
    }
  } catch (err) {
    console.error("Error generating JSX template:", err);
    res.status(500).json({ error: "Failed to generate template" });
  }
});

export default router;
