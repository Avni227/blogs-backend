
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate reset password email template
const emailTemplate = ({ username, resetPasswordUrl }) => {

  // Read HTML file
  const templatePath = path.join(
    __dirname,
    "../templates/emailTemplate.html"
  );

  let html = fs.readFileSync(templatePath, "utf-8");

  // Replace placeholders
  html = html.replaceAll("{{username}}", username);
  html = html.replaceAll("{{resetPasswordUrl}}", resetPasswordUrl);

  return html;
};

export default emailTemplate;
