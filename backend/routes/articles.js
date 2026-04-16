// routes/articles.js
import express from "express";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getAllArticles() {
  const articlesDir = path.join(__dirname, "..", "content", "articles");
  const files = await fs.readdir(articlesDir);
  const articlesData = [];

  for (const fileName of files) {
    if (fileName.endsWith(".md")) {
      const filePath = path.join(articlesDir, fileName);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      articlesData.push({
        ...data,
        rawContent: content,
        html: marked(content)
      });
    }
  }

  articlesData.sort((a, b) => new Date(b.date) - new Date(a.date));
  return articlesData;
}

router.get("/", async (req, res) => {
  try {
    const articles = await getAllArticles();
    const q = req.query.q?.toLowerCase();
    const type = req.query.type;
    let results = articles;

    if (type) {
      results = results.filter(a => a.type?.includes(type));
    }

    if (q) {
      results = results
        .map(article => {
          let score = 0;
          if (article.title?.toLowerCase().includes(q)) score += 3;
          if (article.excerpt?.toLowerCase().includes(q)) score += 2;
          if (article.rawContent?.toLowerCase().includes(q)) score += 1;
          return score > 0 ? { ...article, score } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score);
    }

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "სტატიები ვერ მოიძებნა" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const articles = await getAllArticles();
    const article = articles.find(a => a.slug === slug);

    if (!article) return res.status(404).json({ message: "სტატია ვერ მოიძებნა" });
    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "სტატია ვერ მოიძებნა" });
  }
});

export default router;