// routes/generateJsx.jsx
import express from "express";
import puppeteer from "puppeteer";
import ReactDOMServer from "react-dom/server";

// ✅ Adjust path to your JSX template component
import ResumeTemplateJsx from "../templates/jsx/ResumeTemplate.jsx";

const router = express.Router();

router.post("/", async (req, res) => {
  const { asHtml, asPdf, ...cvData } = req.body;

  try {
    // ✅ JSX rendering requires React in scope
    const reactHtmlContent = ReactDOMServer.renderToStaticMarkup(
      <ResumeTemplateJsx {...cvData} />
    );

    const jsxCss = `
      body {
        font-family: "Inter", sans-serif;
        line-height: 1.6;
        color: #333;
        background: #ffffff;
      }
      .container {
        max-width: 850px;
        margin: 0 auto;
        background: white;
        min-height: 100vh;
        padding: 0px 50px;
      }
      .cv-layout {
        display: flex;
        flex-direction: row;
        min-height: 100vh;
      }
      .sidebar {
        flex: 0 0 250px;
        background: #f0f2f5;
        padding: 30px;
        color: #333;
      }
      .main-content {
        flex-grow: 1;
        padding: 30px 50px;
      }
      .profile-name {
        font-size: 2rem;
        font-weight: bold;
        color: #2c3e50;
      }
      .section-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 15px;
        color: #2c3e50;
        border-bottom: 1px solid #ccc;
      }
      .experience-item, .education-item, .project-item {
        margin-bottom: 20px;
      }
    `;

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${cvData?.personalInfo?.name || "Resume"}</title>
        <style>${jsxCss}</style>
      </head>
      <body>
        <div class="cv-layout">
          ${reactHtmlContent}
        </div>
      </body>
      </html>
    `;

    // If HTML preview requested
    if (asHtml) {
      return res.send(fullHtml);
    }

    // If PDF generation requested
    if (asPdf) {
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.setContent(fullHtml, { waitUntil: "networkidle0" });
      await page.emulateMediaType("screen");

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "0.5in",
          right: "0.5in",
          bottom: "0.5in",
          left: "0.5in",
        },
      });

      await browser.close();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${(
          cvData?.personalInfo?.name || "resume"
        ).replace(/\s+/g, "_")}.pdf"`
      );
      return res.send(pdfBuffer);
    }

    // Neither flag present
    res
      .status(400)
      .send("Invalid request. Set 'asHtml' or 'asPdf' in request body.");
  } catch (err) {
    console.error("PDF/HTML generation failed:", err);
    res.status(500).send("Failed to render or generate PDF.");
  }
});

export default router;
