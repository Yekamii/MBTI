// FinalResults.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../Register.css";

const typeDescriptions = {
  ENFP: "„აღმომჩენი“ – ენერგიული, კრეატიული და მხიარული ადამიანები არიან. უყვართ ახალი იდეები, თავგადასავლები და ადამიანებთან ურთიერთობა. ადვილად შთააგონებენ სხვებს, არიან ოპტიმისტები და ყოველთვის ცდილობენ პოზიტიური გარემოს შექმნას.",
  ISTJ: "„ლოჯისტიკოსი“ – პრაქტიკული, საიმედო და პასუხისმგებლიანი ადამიანები არიან. აფასებენ წესრიგს, სტრუქტურასა და ტრადიციებს. დეტალებზე ორიენტირებულნი, ყოველთვის ასრულებენ დანაპირებს და სხვებისთვის სანდო პარტნიორები არიან.",
  INFJ: "„მრჩეველი“ – ღრმა და ემპათიური ადამიანები არიან. აქვთ ძლიერი ინტუიცია. აფასებენ ადამიანურ ურთიერთობებს, ხშირად ეხმარებიან სხვებს განვითარებაში და ცდილობენ სამყაროში პოზიტიური ცვლილებების შეტანას.",
  ESFP: "„არტისტი“ – ენერგიული, მხიარული და უშუალო ადამიანები არიან. სიამოვნებას იღებენ ადამიანების გარემოცვაში ყოფნით და ყურადღების ცენტრში ყოფნა უყვართ. სპონტანურები, ოპტიმისტები და ცხოვრებისგან სიამოვნების მიღებაზე ორიენტირებულნი არიან.",
  INFP: "„მედიატორი“ – იდეალისტი, ემპათიური და შემოქმედებითი ადამიანები არიან. ღრმად აფასებენ ადამიანურ ღირებულებებს, მეგობრობასა და ჰარმონიას. ხშირად ფანტაზიით მდიდარი და სულიერად მგრძნობიარე ბუნება აქვთ.",
  ESTJ: "„მმართველი“ – ორგანიზებული, პრაქტიკული და ლიდერული თვისებებით გამორჩეული ადამიანები არიან. უყვართ წესრიგი, მკაფიო გეგმები და პასუხისმგებლობის აღება. კარგად მართავენ გუნდებს და შედეგზე არიან ორიენტირებულნი.",
  ENFJ: "„პროტაგონისტი“ – კომუნიკაბელური, მოტივატორი და მზრუნველი ადამიანები არიან. ხშირად სხვების მხარდაჭერას და დახმარებას ცდილობენ. ძლიერი სოციალური ინტელექტი აქვთ და ბუნებრივ ლიდერებად ითვლებიან.",
  ISFP: "„თავგადასავლების მოყვარული“ – მშვიდი, შემოქმედებითი და ბუნებაზე ორიენტირებული ადამიანები არიან. აფასებენ თავისუფლებას და ცდილობენ ცხოვრებისგან სიამოვნების მიღებას. კონფლიქტებს ერიდებიან და კომფორტულ გარემოს ქმნიან.",
  ISTP: "„ვირტუოზი“ – პრაქტიკული, ანალიტიკური და მოქნილი ადამიანები არიან. ტექნიკური აზროვნება აქვთ და პრობლემებს სწრაფად წყვეტენ. ცვლილებებს მარტივად ეგუებიან და რეალურ სიტუაციებში გამოსავალს პოულობენ.",
  ESFJ: "„კონსული“ – გულწრფელი, სოციალური და მზრუნველი ადამიანები არიან. უყვართ სხვების დახმარება და ჰარმონიული გარემოს შექმნა. პასუხისმგებლიანები და ერთგულები არიან მეგობრებისა და ოჯახის მიმართ.",
  ENTJ: "„კომანდორი“ – თავდაჯერებული, ამბიციური და სტრატეგიული ადამიანები არიან. ბუნებით ლიდერები, რომლებიც სწრაფად იღებენ გადაწყვეტილებებს და ეფექტურად მართავენ გუნდებს.",
  INTJ: "„არქიტექტორი“ – დამოუკიდებელი, სტრატეგიული და ანალიტიკური ადამიანები არიან. მუდმივად ცდილობენ ცოდნის გაფართოებას და თვითგანვითარებას. აფასებენ ლოგიკას და გრძელვადიან გეგმებზე ფიქრობენ.",
  ESTP: "„მეწარმე“ – აქტიური, ენერგიული და რისკის მოყვარული ადამიანები არიან. სწრაფად მოქმედებენ და პრობლემებს პრაქტიკული მიდგომით აგვარებენ. სიამოვნებას იღებენ დინამიკური ცხოვრებით.",
  ENTP: "„ინოვატორი“ – კრეატიული, ცნობისმოყვარე და იდეებით სავსე ადამიანები არიან. უყვართ დისკუსიები და ახალი გზების პოვნა. სწრაფად სწავლობენ და ხშირად არასტანდარტულ გადაწყვეტილებებს პოულობენ.",
  ISFJ: "„დამცველი“ – ერთგული, პასუხისმგებლიანი და მზრუნველი ადამიანები არიან. განსაკუთრებულ ზრუნვას იჩენენ ოჯახის და მეგობრების მიმართ. სტაბილურობა და ჰარმონია მათთვის ძალიან მნიშვნელოვანია.",
  INTP: "„ლოგიკოსი“ – ძლიერი ლოგიკური აზროვნებითა და ინტელექტუალური ცნობისმოყვარეობით გამოირჩევიან. მშვიდი და თავშეკავებული ბუნების მიუხედავად, ღრმად აანალიზებენ იდეებს და სიამოვნებას იღებენ ახალი ცოდნის აღმოჩენით."
};

export default function FinalResults({ results }) {

  const [user, setUser] = useState(false);
  const [savedResults, setSavedResults] = useState([]);
  const [type, setType] = useState("");
  const [articles, setArticles] = useState([]);
  const location = useLocation();

  useEffect(() => {

    const token = localStorage.getItem("auth_token");
    if (token) setUser(true);

    let calculated =
      (results?.EI || "") +
      (results?.SN || "") +
      (results?.TF || "") +
      (results?.JP || "");

    if (!calculated || calculated.length !== 4) {
      const params = new URLSearchParams(location.search);
      calculated = params.get("type") || "";
    }

    if (!calculated || calculated.length !== 4) {
      calculated = localStorage.getItem("pendingResult") || "";
    }

    if (calculated.length === 4) {
      const finalType = calculated.toUpperCase();
      setType(finalType);

      if (!token) {
        localStorage.setItem("pendingResult", finalType);
      }
    }

  }, [results, location]);

  useEffect(() => {
    if (!type) return;

    fetch(`http://localhost:5000/api/articles?type=${type}`)
      .then(res => res.json())
      .then(data => setArticles(data || []))
      .catch(() => setArticles([]));

  }, [type]);

  const toggleSave = async () => {

    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {

      const res = await fetch("http://localhost:5000/api/user/mbti",{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({ mbtiType:type })
      });

      const updatedUser = await res.json();
      setSavedResults(updatedUser.savedResults || []);

    } catch(err){
      console.error("MBTI save error:",err);
    }
  };

  if (!type) return <p>Loading...</p>;

  return (
    <div className="result-layout">

      <div className="register-page">

        <div className="register-card">

          {user && (
            <img
              src={savedResults.includes(type) ? "/save1.png" : "/save.png"}
              className="save-icon-result"
              onClick={toggleSave}
              alt="save"
            />
          )}

          <img
            className="result-image"
            src={`http://localhost:5000/images/${type}.png`}
            alt={type}
            onError={(e)=>{e.target.src="http://localhost:5000/images/default.jpg"}}
/         >
          <h2 className="register-title">{type}</h2>
          <p className="register-description">{typeDescriptions[type]}</p>

          {!user && (
            <p className="register-text">
              მონაცემების შესანახად{" "}
              <Link
                to="/register"
                className="register-link"
                onClick={()=>localStorage.setItem("pendingResult",type)}
              >
                გაიარე რეგისტრაცია
              </Link>
            </p>
          )}

        </div>

      </div>

      {articles.length > 0 && (
        <div className="articles-sidebar">

          <h3 className="sidebar-title">მეტი ინფორმაცია შენი ფსიქოტიპის შესახებ</h3>

          {articles.map(a => (

            <Link key={a.slug} to={`/articles/${a.slug}`} className="article-card">

              <img
                className="article-thumb"
                alt={a.title}
                src={a.image ? `http://localhost:5000${a.image}` : "http://localhost:5000/images/default.jpg"}
              />

              <div className="article-info">
                <b>{a.title}</b>
                <p>{a.excerpt}</p>
              </div>

            </Link>

          ))}

        </div>
      )}

    </div>
  );
}