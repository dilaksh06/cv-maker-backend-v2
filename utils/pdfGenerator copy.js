import ejs from "ejs";
import { dirname, join } from "path";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";

// __dirname workaround in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generatePDF(data) {
    try {
        // console.log("Data passed to generatePDF:", data);

        // Sanitize and ensure all sections exist even if empty
        const sanitizedData = {
            personalInfo: data.personalInfo || {},
            aboutMe: data.aboutMe || "No information provided.",
            hardSkills: Array.isArray(data.hardSkills) ? data.hardSkills : [],
            languages: Array.isArray(data.languages) ? data.languages : [],
            workExperience: Array.isArray(data.workExperience) ? data.workExperience : [],
            academicQualifications: Array.isArray(data.academicQualifications) ? data.academicQualifications : [],
            projects: Array.isArray(data.projects) ? data.projects : [],
            publications: Array.isArray(data.publications) ? data.publications : [],
            recommendations: Array.isArray(data.recommendations) ? data.recommendations : []
        };

        // Render HTML from EJS template
        const html = await ejs.renderFile(join(__dirname, "../templates/cv.ejs"), sanitizedData);

        // Launch Puppeteer browser
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Load the HTML content into the page
        await page.setContent(html, { waitUntil: "load" });

        // Optional debug: capture screenshot of rendered HTML
        // await page.screenshot({ path: "debug.png" });

        // Generate PDF from the rendered HTML
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true
        });

        await browser.close();
        return pdfBuffer;

    } catch (error) {
        console.error("Error generating PDF:", error.message);
        throw new Error("Failed to generate PDF");
    }
}

export default generatePDF;
