import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* კონტაქტი */}
        <div className="footer-column">
          <span className="footer-title">კონტაქტი</span>
          <div className="footer-icons">
            <a href="mailto:yekami.yekami@gmail.com" aria-label="Email">
              <img 
                src="/gmail.png" 
                alt="Gmail"
                onError={(e)=>{e.target.style.display="none"}}
              />
            </a>
          </div>
        </div>

        {/* გაზიარება */}
        <div className="footer-column">
          <span className="footer-title">გაზიარება</span>
          <div className="footer-icons">
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <img 
                src="/instalog.png" 
                alt="Instagram"
                onError={(e)=>{e.target.style.display="none"}}
              />
            </a>

            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <img 
                src="/facebook.png" 
                alt="Facebook"
                onError={(e)=>{e.target.style.display="none"}}
              />
            </a>
          </div>
        </div>
      </div>

      <span className="footer-date">
        © {new Date().getFullYear()} MBTI
      </span>
    </footer>
  );
}