// ArticleDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Article.css";

function formatDateKa(dateStr) {
  const months = [
    "იანვარი","თებერვალი","მარტი","აპრილი","მაისი","ივნისი",
    "ივლისი","აგვისტო","სექტემბერი","ოქტომბერი","ნოემბერი","დეკემბერი"
  ];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function ArticleDetail() {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [user, setUser] = useState(false);
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    // Load article
    fetch(`http://localhost:5000/api/articles/${slug}`)
      .then(res => res.json())
      .then(data => setArticle(data))
      .catch(err => console.error("FETCH ERROR:", err));

    // Load user saved articles
    const token = localStorage.getItem("auth_token");
    if (token) {
      setUser(true);

      fetch("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setSaved(Array.isArray(data.savedArticles) ? data.savedArticles : []))
        .catch(err => setSaved([]));
    }
  }, [slug]);

  if (!article) return <p>იტვირთება...</p>;

  const isSaved = Array.isArray(saved) && saved.find(a => a.slug === article.slug);

  const toggleSave = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    let res;
    if (isSaved) {
      res = await fetch("http://localhost:5000/api/user/remove-article", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ slug: article.slug })
      });
    } else {
      res = await fetch("http://localhost:5000/api/user/save-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ article })
      });
    }

    const data = await res.json();
    setSaved(Array.isArray(data) ? data : []);
  };

  return (
    <div className="article-page">
      <div className="article-container" style={{ position: "relative" }}>
        {user && (
          <img
            src={isSaved ? "/save1.png" : "/save.png"}
            className="save-icon-article"
            onClick={toggleSave}
            alt="save"
          />
        )}

        <h1 className="article-title">{article.title}</h1>

        <img
          src={`http://localhost:5000${article.image}`}
          alt={article.title}
          className="article-hero"
        />

        <p style={{
          color:"#6d6d6db6",
          fontSize:"14px",
          textAlign:"center",
          marginBottom:"30px"
        }}>
          {formatDateKa(article.date)}
        </p>

        <div
          className="lead"
          dangerouslySetInnerHTML={{ __html: article.html }}
        />
      </div>
    </div>
  );
}