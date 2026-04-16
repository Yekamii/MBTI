import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";

function highlight(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

function MBTIOverview() {
  const { search } = useLocation();
  const queryParam = new URLSearchParams(search).get("q") || "";
  const query = useDebounce(queryParam);

  const [articles, setArticles] = useState([]);
  const [saved, setSaved] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) setUser(true);

    const savedArticles =
      JSON.parse(localStorage.getItem("savedArticles")) || [];
    setSaved(savedArticles);
  }, []);

  useEffect(() => {
    if (!query) return;

    fetch(`/api/articles?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => setArticles(data))
      .catch(() => setArticles([]));
  }, [query]);

  const toggleSave = (article) => {
    let updated;

    if (saved.find(a => a.slug === article.slug)) {
      updated = saved.filter(a => a.slug !== article.slug);
    } else {
      updated = [...saved, article];
    }

    setSaved(updated);
    localStorage.setItem("savedArticles", JSON.stringify(updated));
  };

  return (
    <section className="articles-page">
      <h2>ძიების შედეგები: „{queryParam}“</h2>

      {articles.map(a => {
        const isSaved = saved.find(s => s.slug === a.slug);

        return (
          <article key={a.slug} className="article-card">
            {user && (
              <img
                src={isSaved ? "/images/save1.png" : "/images/save.png"}
                alt="save"
                className="save-icon"
                onClick={() => toggleSave(a)}
              />
            )}

            <Link to={`/articles/${a.slug}`}>
              <h3
                dangerouslySetInnerHTML={{
                  __html: highlight(a.title, queryParam)
                }}
              />
            </Link>

            <p
              dangerouslySetInnerHTML={{
                __html: highlight(a.excerpt, queryParam)
              }}
            />
          </article>
        );
      })}
    </section>
  );
}

export default MBTIOverview;

