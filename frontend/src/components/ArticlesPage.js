// ArticlesPage.js
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./ArticlesPage.css";

function formatDateKa(dateStr) {
  const months = [
    "იანვარი","თებერვალი","მარტი","აპრილი","მაისი","ივნისი",
    "ივლისი","აგვისტო","სექტემბერი","ოქტომბერი","ნოემბერი","დეკემბერი"
  ];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function highlight(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

export default function ArticlesPage() {

  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q") || "";

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [saved, setSaved] = useState([]);
  const [user, setUser] = useState(false);

  useEffect(()=>{

    const token = localStorage.getItem("auth_token");

    if(token){

      setUser(true);

      fetch("http://localhost:5000/api/user/profile",{
        headers:{ Authorization:`Bearer ${token}` }
      })
      .then(res=>res.json())
      .then(data=>setSaved(data.savedArticles || []));

    }

  },[]);


  useEffect(() => {

    setLoading(true);
    setSearched(!!query);

    const url = query
      ? `http://127.0.0.1:5000/api/articles?q=${encodeURIComponent(query)}`
      : "http://127.0.0.1:5000/api/articles";

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("FETCH ERROR:", err);
        setLoading(false);
      });

  }, [query]);


  const toggleSave = async (article)=>{

    const token = localStorage.getItem("auth_token");
    if(!token) return;

    const exists = saved.find(a => a.slug === article.slug);

    let res;

    if(exists){

      res = await fetch("http://localhost:5000/api/user/remove-article",{
        method:"DELETE",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({ slug:article.slug })
      });

    }else{

      res = await fetch("http://localhost:5000/api/user/save-article",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({ article })
      });

    }

    const data = await res.json();
    setSaved(data);

  };


  return (
    <div className="articles-page">

      {query && <h2>ძიების შედეგები: „{query}“</h2>}

      {loading && <p>🔍 ძებნა მიმდინარეობს...</p>}

      {!loading && searched && articles.length === 0 && (
        <p>... სტატიები ვერ მოიძებნა</p>
      )}

      <div className="articles-gr">

        {!loading && articles.map((article,index)=>{

          const isSaved = saved.find(a => a.slug === article.slug);

          return (

            <div
              key={article.slug}
              className="article-ca"
              style={{animationDelay:`${index*0.2}s`,position:"relative"}}
            >

              {user && (
                <img
                  src={isSaved ? "/save1.png" : "/save.png"}
                  className="save-icon-card"
                  onClick={()=>toggleSave(article)}
                  alt="save"
                />
              )}

              <img
                src={`http://localhost:5000${article.image}`}
                alt={article.title}
                className="article-image"
                onError={(e)=>{e.target.src="http://localhost:5000/images/default.jpg"}}
              />

              <div className="article-content">

                <h2
                  dangerouslySetInnerHTML={{
                    __html: highlight(article.title, query)
                  }}
                />

                <p
                  className="article-excerpt"
                  dangerouslySetInnerHTML={{
                    __html: highlight(article.excerpt, query)
                  }}
                />

                <p className="article-date">
                  {formatDateKa(article.date)}
                </p>

                <Link
                  to={`/articles/${article.slug}`}
                  className="article-link"
                >
                  წაიკითხე სრულად →
                </Link>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}