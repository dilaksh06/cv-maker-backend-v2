// utils/htmlRenderer.js
import ejs from "ejs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function generateHTML({ templateId, ...data }) {
    const sanitizedData = {
        personalInfo: data.personalInfo || {},
        aboutMe: data.aboutMe || "No information provided.",
        hardSkills: Array.isArray(data.hardSkills) ? data.hardSkills : [],
        languages: Array.isArray(data.languages) ? data.languages : [],
        workExperience: Array.isArray(data.workExperience) ? data.workExperience : [],
        academicQualifications: Array.isArray(data.academicQualifications) ? data.academicQualifications : [],
        projects: Array.isArray(data.projects) ? data.projects : [],
        publications: Array.isArray(data.publications) ? data.publications : [],
        recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
    };

    const templatePath = join(__dirname, `../templates/${templateId}.ejs`);

    try {
        const html = await ejs.renderFile(templatePath, sanitizedData);
        return html;
    } catch (err) {
        console.error("EJS render error:", err);
        throw err;
    }
}
