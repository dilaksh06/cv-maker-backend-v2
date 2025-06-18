// utils/htmlRenderer.js
import ejs from 'ejs';
import fs from 'fs/promises';
import path from 'path';

const templatesDir = path.resolve("templates"); // folder where .ejs templates are

const generateHTML = async ({ templateId, ...cvData }) => {
    const filePath = path.join(templatesDir, `${templateId}.ejs`);

    try {
        const templateContent = await fs.readFile(filePath, 'utf-8');
        const renderedHTML = ejs.render(templateContent, cvData); // inject user data
        return renderedHTML;
    } catch (error) {
        console.error("EJS render error:", error);
        throw error;
    }
};

export default generateHTML;
