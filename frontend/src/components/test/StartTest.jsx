import React from "react";
import "./StartTest.css";
import { useNavigate } from "react-router-dom";



export default function StartTest() {
  const navigate = useNavigate();
  return (
    <section className="test-page">
      <div className="test-card">

        <h1 className="test-title">MBTI ტესტი</h1>

        <p className="test-description">
          ტესტი აფასებს პიროვნულ მახასიათებლებს&#44; ის არ ზომავს ინტელექტს ან ფსიქოლოგიურ მდგომარეობებს&#46; უპასუხეთ გულწრფელად&#44; გაითვალისწინეთ  თქვენი ქცევის ზოგადი ტენდენცია და არა კონკრეტული სიტუაციები&#46; 
        </p>

        <button className="test-button"
        onClick={() => navigate("/test")}
        >
          ტესტის დაწყება
        </button>

      </div>
    </section>
  );
}
