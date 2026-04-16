// helpers/articleContext.js
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";
import { matchesSynonym } from "./semantic.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getContextFromSite(userMessage) {
  try {
    const articlesDir = path.join(__dirname, "..", "content", "articles");
    const files = await fs.readdir(articlesDir);

    let matchedContents = [];

    for (const file of files) {
      if (!file.endsWith(".md")) continue;

      const contentRaw = await fs.readFile(path.join(articlesDir, file), "utf-8");
      const { content: articleContent, data: meta } = matter(contentRaw);
      const paragraphs = articleContent.split(/\n\s*\n/);

      paragraphs.forEach((para) => {
        // semantic match: if paragraph has any keyword or synonym
        const words = para.split(/\s+/);
        const relevant = words.some((w) => matchesSynonym(userMessage, w));
        if (relevant) {
          matchedContents.push({
            text: para.trim(),
            title: meta?.title || "სტატია"
          });
        }
      });
    }

    // მხოლოდ 5 ყველაზე შესაბამისი აბზაცი
    return matchedContents.slice(0, 5).map(p => `${p.title}: ${p.text}`).join("\n\n");

  } catch (err) {
    console.error("getContextFromSite error:", err);
    return "";
  }
}