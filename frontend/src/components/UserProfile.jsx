// UserProfile.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import PersonalAIMentor from "./PersonalAIMentor";
import { AuthContext } from "../context/AuthContext";
import "./UserProfile.css";

const typeDescriptions = {
  ENFP: "„აღმომჩენი“ - ენერგიული, კრეატიული და მხნე. უყვართ ახალი იდეები, ურთიერთობები და ადამიანების შთაგონება. გამოირჩევიან სხვების მხარდაჭერით, უშუალო კომუნიკაციითა და აქვთ გადამდები ენერგეტიკა.",
  ISTJ: "„ლოჯისტიკოსი“ - პრაქტიკული, საიმედო და დეტალებზე ორიენტირებული ადამიანები არიან, რომლებიც აფასებენ სტრუქტურას, წესრიგსა და პასუხისმგებლობას. ყოველთვის ასრულებენ დანაპირებს.",
  INFJ: "„მრჩეველი, იდეალისტი“ - სულიერად მდიდარი, შემოქმედებითი, მზრუნველი და გულწრფელი ადამიანები არიან. აფასებენ ურთიერთობებს, შთააგონებენ სხვებს და არიან მოტივატორები.",
  ESFP: "„პერფორმერი“ - ენერგიული, მეგობრული და უშუალო ადამიანები არიან. სიამოვნებას იღებენ სხვების გარემოცვაში ყოფნით, რადგან უყვართ ყურადღების ცენტრში ყოფნა. არიან სპონტანურები, მხიარულები და ოპტიმისტურები.",
  INFP: "„მედიატორი“ - სულიერად მგრძნობიარე, იდეალისტი, შემოქმედებითი და ემპათიური ადამიანები არიან. მნიშვნელობას ანიჭებენ ადამიანურ ღირებულებებს. გამოირჩევიან ჰარმონიული ცხოვრების წესით და განსაკუთრებულ ყურადღებას უთმობენ ოჯახსა და ახლო მეგობრებს.",
  ESTJ: "„აღმსრულებელი, მმართველი“ - პრაქტიკული, პასუხისმგებლობით აღჭურვილი და ორგანიზებული ადამიანები არიან, რომლებიც აფასებენ წესრიგს, სტრუქტურასა და ტრადიციებს. უყვართ მკაფიო წესები და მოქმედებენ გათვლილი გეგმით. გამოირჩევიან ლიდერული თვისებებით.",
  ENFJ: "„პროტაგონისტი“ - პასუხისმგებლობით აღჭურვილი, ენერგიული და ერთგული ადამიანები არიან, რომლებიც გამოირჩევიან კომუნიკაბელურობით, ძლიერი სოციალური ინტელექტით და სხვების მოტივირების უნარით. ხშირად იღებენ პასუხისმგებლობას ჯგუფის კეთილდღეობაზე და უყვართ როცა თავს საჭიროდ გრძნობენ.",
  ISFP: "„თავგადასავლების მოყვარული“ - მშვიდი, შემოქმედებითი და ბუნებაზე ორიენტირებული ადამიანები არიან. უყვართ გამოცდილებით სწავლა და ცდილობენ მიიღონ სიამოვნება ცხოვრებისგან. თავს არიდებენ კონფლიქტურ სიტუაციებს და ქმნიან კომფორტს გარშემომყოფებისთვის.",
  ISTP: "„ვირტუოზი“ - პრაქტიკული, ანალიტიკური და მოქნილი ადამიანები არიან, რომლებიც გამოირჩევიან ტექნიკური აზროვნებითა და პრობლემების სწრაფად გადაჭრის უნარით. მარტივად ერგებიან ცვლილებებს და პოულობენ გამოსავალს რეალურ სიტუაციებში.",
  ESFJ: "„კონსული“ - გულწრფელი, სანდო, სოციალური და მოსიყვარულე ადამიანები არიან, რომლებიც გამოირჩევიან პასუხისმგებლობის ძლიერი გრძნობით. ცდილობენ შექმნან ჰარმონიული გარემო მეგობრებისა და კოლეგებისთვის. მგრძნობიარენი არიან კრიტიკისა და ცვლილებებისადმი.",
  ENTJ: "„კომანდირი“ - თავდაჯერებული, მიზანდასახული, ამბიციური და სტრატეგიული ადამიანები არიან. ბუნებით ლიდერები, რომლებიც სწრაფად იღებენ გადაწყვეტილებებს და ეფექტურად მართავენ გუნდებს.",
  INTJ: "„არქიტექტორი“ - სტრატეგიული, დამოუკიდებელი და ანალიტიკური ადამიანები არიან, რომლებიც მუდმივად ცდილობენ თვითგანვითარებას. აფასებენ ლოგიკასა და ფაქტებს და ხშირად რთულად აყალიბებენ ჰარმონიულ ურთიერთობებს.",
  ESTP: "„მეწარმე“ - აქტიური, რისკის მოყვარული და პრაქტიკული ადამიანები არიან, რომლებიც სწრაფად მოქმედებენ და პრობლემებს ლოგიკური მიდგომით აგვარებენ. ცხოვრობენ აწმყოში და სიამოვნებას იღებენ დინამიკით.",
  ENTP: "„ინოვატორი“ - ინტელექტუალური დისკუსიებისა და ინოვაციის მოყვარული ადამიანები არიან, ქარიზმატული და ენერგიულები, მუდმივად ეძებენ ახალ ცოდნასა და გამოცდილებას.",
  ISFJ: "„დამცველი“ - გულწრფელი, მოსიყვარულე და პასუხისმგებლიანი ადამიანები არიან, რომლებიც განსაკუთრებულ ზრუნვას იჩენენ სხვების მიმართ. მათთვის მნიშვნელოვანია სტაბილურობა და ერთგულება.",
  INTP: "„ლოგიკოსი“ - ძლიერი ლოგიკური აზროვნებითა და ინტელექტუალური ცნობისმოყვარეობით გამოირჩევიან. მშვიდი და თავშეკავებული ბუნების მიუხედავად, აქტიურად არიან ჩართულნი პრობლემების გაანალიზებაში და თეორიული საკითხების შესწავლაში."
};

export default function UserProfile() {
  const { user } = useContext(AuthContext);
  const [savedArticles, setSavedArticles] = useState([]);
  const [savedResults, setSavedResults] = useState([]);
  const [openResults, setOpenResults] = useState({});
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const sidebarRef = useRef(null);

  const [memory] = useState({
    lastGoal: localStorage.getItem("lastGoal") || "",
    lastInterest: localStorage.getItem("lastInterest") || "",
    lastTone: localStorage.getItem("lastTone") || "neutral",
    lastEmotion: localStorage.getItem("lastEmotion") || "neutral"
  });

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    fetch("http://localhost:5000/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Profile fetch failed");
        return res.json();
      })
      .then(data => {
        setSavedArticles(data.savedArticles || []);
        setSavedResults(data.savedResults || []);
      })
      .catch(err => console.error("Profile load error:", err));
  }, []);

  useEffect(() => {
    if (!savedResults?.length) return;

    const lastType = savedResults[savedResults.length - 1];

    fetch(`http://localhost:5000/api/articles?type=${lastType}`)
      .then(res => {
        if (!res.ok) throw new Error("Articles fetch failed");
        return res.json();
      })
      .then(data => setRecommendedArticles(data || []))
      .catch(err => {
        console.error(err);
        setRecommendedArticles([]);
      });
  }, [savedResults]);

  useEffect(() => {
    if (!recommendedArticles.length) return;

    const sidebar = sidebarRef.current;
    let scrollAmount = 0;

    const interval = setInterval(() => {
      if (!sidebar) return;

      scrollAmount += 60;
      if (scrollAmount > sidebar.scrollHeight - sidebar.clientHeight) {
        scrollAmount = 0;
      }
      sidebar.scrollTo({ top: scrollAmount, behavior: "smooth" });
    }, 3000);

    return () => clearInterval(interval);
  }, [recommendedArticles]);

  if (!user) return null;

  const removeArticle = async (slug) => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/user/remove-article", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ slug })
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setSavedArticles(data);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const removeResult = async () => {
  const token = localStorage.getItem("auth_token");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:5000/api/user/mbti", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to delete");

    const updatedUser = await res.json();

    setSavedResults(updatedUser.savedResults || []);
    setOpenResults({});

  } catch (err) {
    console.error("Delete MBTI error:", err);
  }
};

  const userPhoto = user.photo ? user.photo.replace("http:", "https:") : "/images/default.png";

  return (
    <section className="profile-page">
      <div className="profile-left">
        <img
          src={userPhoto}
          alt={user.email}
          className="profile-avatar"
          onError={e => (e.target.src = "/images/default.png")}
        />
        <span className="profile-email">{user.email}</span>

        <PersonalAIMentor
          userType={savedResults[savedResults.length - 1] || "DEFAULT"}
          memory={memory}
        />
      </div>

      {savedResults.length > 0 && (
        <div className="saved-results">
          {savedResults.map(result => (
            <div key={result} className="saved-result">
              <img src="/save1.png" alt="remove" className="remove-icon-result" onClick={removeResult} />
              <img src={`/images/types/${result}.png`} width="180" alt={result} />
              <p className={`test-descript ${openResults[result] ? "open" : ""}`}>
                {typeDescriptions[result]}
              </p>
              <span className="toggle-desc" onClick={() => setOpenResults(prev => ({ ...prev, [result]: !prev[result] }))}>
                {openResults[result] ? "შეკეცვა" : "გახსნა"}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="saved-section">
        <h3>შენახული სტატიები</h3>
        <div className="saved-cards">
          {savedArticles.map(a => (
            <div key={a.slug} className="saved-card-container">
              <Link to={`/articles/${a.slug}`} className="saved-card">
                <img
                  src={a.image ? `http://localhost:5000${a.image}` : "/images/default.png"}
                  alt={a.title}
                  className="saved-card-image"
                />
                <p className="saved-card-title">{a.title}</p>
              </Link>
              <img src="/save1.png" className="remove-icon-card" alt="remove" onClick={() => removeArticle(a.slug)} />
            </div>
          ))}
        </div>
      </div>

      {recommendedArticles.length > 0 && (
        <div className="profile-articles-sidebar" ref={sidebarRef}>
          <h3 className="sidebar-title">შენთვის რეკომენდებული სტატიები</h3>
          {recommendedArticles.map(a => (
            <Link key={a.slug} to={`/articles/${a.slug}`} className="article-card">
              <img
                className="article-thumb"
                alt={a.title}
                src={a.image ? `http://localhost:5000${a.image}` : "/images/default.png"}
              />
              <div className="article-info">
                <b>{a.title}</b>
                <p>{a.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}