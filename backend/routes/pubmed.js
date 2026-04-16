import express from "express";
import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";

const router = express.Router();

/* =========================
   PubMed 
========================= */

const HEADERS = {
  "User-Agent": "MBTI-Research-App/1.0",
  "From": "yekami.yekami@gmail.com"
};

const QUERY = "personality psychology MBTI";
const RETMAX = 5;

// memory
let cachedArticles = null;
let lastFetchTime = 0;
const CACHE_TTL = 10 * 60 * 1000; 

/* =========================
   Route
========================= */

router.get("/", async (req, res) => {
  try {
    //  check
    if (cachedArticles && Date.now() - lastFetchTime < CACHE_TTL) {
      return res.json(cachedArticles);
    }

    /* =========================
       ESearch 
    ========================= */

    const searchUrl =
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi" +
      `?db=pubmed&retmode=json&retmax=${RETMAX}&term=${encodeURIComponent(QUERY)}`;

    const searchRes = await fetch(searchUrl, { headers: HEADERS });

    if (!searchRes.ok) {
      throw new Error(`ESearch failed: ${searchRes.status}`);
    }

    const searchData = await searchRes.json();
    const ids = searchData?.esearchresult?.idlist || [];

    if (!ids.length) {
      cachedArticles = [];
      lastFetchTime = Date.now();
      return res.json([]);
    }

    /* =========================
       EFetch 
    ========================= */

    const fetchUrl =
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi" +
      `?db=pubmed&id=${ids.join(",")}&retmode=xml`;

    const fetchRes = await fetch(fetchUrl, { headers: HEADERS });
    const xmlText = await fetchRes.text();

    //  Rate limit / error 
    if (!xmlText.trim().startsWith("<")) {
      console.error("PubMed non-XML response:", xmlText.slice(0, 200));

      // თუ არსებობს
      if (cachedArticles) {
        return res.json(cachedArticles);
      }

      return res.json([]);
    }

    /* =========================
       XML → JS
    ========================= */

    const parsed = await parseStringPromise(xmlText, {
      explicitArray: false,
      mergeAttrs: true
    });

    const pubmedArticles =
      parsed?.PubmedArticleSet?.PubmedArticle || [];

    const list = Array.isArray(pubmedArticles)
      ? pubmedArticles
      : [pubmedArticles];

    const articles = [];

    for (const art of list) {
      const article = art?.MedlineCitation?.Article;
      const pmid =
        art?.MedlineCitation?.PMID?._ ||
        art?.MedlineCitation?.PMID;

      if (!article || !pmid) continue;

      const title =
        typeof article.ArticleTitle === "string"
          ? article.ArticleTitle
          : article.ArticleTitle?._ || "Untitled PubMed Article";

      articles.push({
        title,
        link: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
        source: "PubMed"
      });
    }

    // შენახვა
    cachedArticles = articles;
    lastFetchTime = Date.now();

    res.json(articles);

  } catch (err) {
    console.error("PUBMED ROUTE ERROR:", err.message);

    
    if (cachedArticles) {
      return res.json(cachedArticles);
    }

    res.json([]);
  }
});

export default router;
