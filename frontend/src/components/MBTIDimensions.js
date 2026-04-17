import { NavLink } from "react-router-dom";
import { useState } from "react";

import "./MBTIDimensions.css";

export default function MBTIDimensions() {
  const [expanded, setExpanded] = useState(null);

  return (
    <main className="dimensions-page">

      {/* ზოგადი ახსნა */}
      <section className={`intro ${expanded === "intro" ? "expanded" : ""}`}>
        <h1>MBTI განზომილებები</h1>

        <p>
          MBTI (Myers&#8210;Briggs Type Indicator) წარმოადგენს პიროვნების ტიპოლოგიას და ეფუძნება კარლ იუნგის ფსიქოლოგიურ თეორიებს&#46; იუნგი აღწერდა&#44; რომ ადამიანებს განსხვავებული ფსიქოლოგიური ფუნდამენტი აქვთ იმის შესახებ თუ როგორ აღიქვამენ ინფორმაციას&#44; იღებენ გადაწყვეტილებებს და რეაგირებენ სამყაროზე&#46; MBTI შექმნაზე მუშაობდნენ კეტრინ ბრიგზი და მისი ქალიშვილი 1940&#8210;50&#8210;იან წლებში&#44; ისინი მიზნად ისახავდნენ ადამიანთა გსიქოტიპების შესწავლას&#46;
        </p>

        <p>
          MBTI ქმნის პრაქტიკულ სისტემას იუნგის იდეების მიხედვით&#44; იგი ხასიათხდება 4 განზომილებით
        </p>

        <p><strong>1&#46;(Extraversion&#8210;E&frasl;Introversion&#8210;I)</strong> ...</p>
        <p><strong>2&#46;(Sensing&#8210;S&frasl;Intuition&#8210;N)</strong> ...</p>
        <p><strong>3&#46;(Thinking&#8210;T&frasl;Feeling&#8210;F)</strong> ...</p>
        <p><strong>4&#46;(Judging&#8210;J&frasl;Perceiving&#8210;P)</strong> ...</p>

        <button
          className="read-more"
          onClick={() =>
            setExpanded(expanded === "intro" ? null : "intro")
          }
        >
          {expanded === "intro" ? "დაკეცვა" : "განაგრძე კითხვა"}
        </button>
      </section>

      {/* T vs A */}
      <section className={`assertive ${expanded === "assertive" ? "expanded" : ""}`}>
        <h2>Turbulent (T) და Assertive (A)</h2>

        <p>ეს განზომილება ცალკე დამატებაა...</p>

        <button
          className="read-more"
          onClick={() =>
            setExpanded(expanded === "assertive" ? null : "assertive")
          }
        >
          {expanded === "assertive" ? "დაკეცვა" : "განაგრძე კითხვა"}
        </button>
      </section>

      {/* სტატიების ქარდი */}
      <section className="articles-preview">
        <h2>გაიგე მეტი</h2>

        <div className="articles-grid">

          <article className="article-card">
            <NavLink to="/ei" className="card-link">
              <img
                src="/ei.png"
                alt="E vs I"
                onError={(e) => (e.target.style.display = "none")}
              />
              <h3>E vs I</h3>
              <p>როგორ განსხვავდება ექსტროვერსია და ინტროვერსია</p>
            </NavLink>
          </article>

          <article className="article-card">
            <NavLink to="/sn" className="card-link">
              <img
                src="/sn.png"
                alt="S vs N"
                onError={(e) => (e.target.style.display = "none")}
              />
              <h3>S vs N</h3>
              <p>ფაქტები თუ ინტუიცია</p>
            </NavLink>
          </article>

          <article className="article-card">
            <NavLink to="/tf" className="card-link">
              <img
                src="/tf.png"
                alt="T vs F"
                onError={(e) => (e.target.style.display = "none")}
              />
              <h3>T vs F</h3>
              <p>ლოგიკა და ემოციები</p>
            </NavLink>
          </article>

          <article className="article-card">
            <NavLink to="/jp" className="card-link">
              <img
                src="/jp.png"
                alt="J vs P"
                onError={(e) => (e.target.style.display = "none")}
              />
              <h3>J vs P</h3>
              <p>სტრუქტურა თუ სპონტანურობა</p>
            </NavLink>
          </article>

        </div>
      </section>

    </main>
  );
}