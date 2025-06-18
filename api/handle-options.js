export default function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "https://dpk-resumi.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).end(); // No content
}
