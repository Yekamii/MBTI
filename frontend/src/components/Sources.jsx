import { useEffect, useState } from "react";

export default function Sources() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchArticles() {
    try {
      const res = await fetch("http://localhost:5000/api/pubmed");
      if (!res.ok) throw new Error("Failed to fetch PubMed data");
      const data = await res.json();

      // ემატება მხოლოდ ახალი სტატიები
      setArticles(prev => {
        const newArticles = data.filter(
          d => !prev.some(a => a.link === d.link)
        );
        return [...prev, ...newArticles];
      });
    } catch (err) {
      console.error("Sources fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    
    fetchArticles();

    // 30 წმ 
    const intervalId = setInterval(fetchArticles, 30000);

    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="page-container">
      <h1>წყაროები და კვლევები</h1>

      <p>
        ეს პლატფორმა ეფუძნება ღია, აკადემიურ და პროფესიულ წყაროებს.
        კონტენტი განკუთვნილია საგანმანათლებლო მიზნებისთვის.
      </p>

      <h2>სტატისტიკური კვლევები PubMed–ზე</h2>
      {loading && articles.length === 0 ? (
        <p>Loading articles...</p>
      ) : (
        <ul className="sources-list">
          {articles.map((article, index) => (
            <li key={index}>
              <a href={article.link} target="_blank" rel="noreferrer">
                {article.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
