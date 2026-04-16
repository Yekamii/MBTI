import React from "react";
import { Link } from "react-router-dom";
import "./HeroSection.css";

export default function HeroSection() {
  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <div className="hero-logo">
          <img src="/mb.png" alt="MBTI Logo" />
        </div>

        <h1 className="hero-title">გაიცანი საკუთარი პიროვნება</h1>

        <p className="hero-description">
          აღმოაჩინე შენი MBTI ტიპი&#44; ძლიერი მხარეები და გადაწყვეტილებების
          მიღების უნიკალური სტილი &#8211; მეცნიერულად&#44; მარტივად და სანდოდ&#46;
        </p>

        <Link to="/start-test" className="hero-button">
          დაიწყე ტესტი
        </Link>
      </div>
    </section>
  );
}
