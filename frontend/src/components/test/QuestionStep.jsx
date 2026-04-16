import React, { useState } from "react";
import "./test.css";

export default function QuestionStep({ dimension, onComplete }) {
  const [phase, setPhase] = useState("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({});

  const questions = dimension.questions;
  const currentQuestion = questions[currentIndex] || null;


  const handleAnswer = (value) => {
    setScore((prev) => ({ ...prev, [value]: (prev[value] || 0) + 1 }));
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setPhase("result");
    }
  };

  const finalResult = (() => {
    const keys = Object.keys(dimension.descriptions);
    if (keys.length === 2) return (score[keys[0]] || 0) >= (score[keys[1]] || 0) ? keys[0] : keys[1];
    return keys[0];
  })();

  return (
    <div className="test-card">
      {phase === "intro" && (
        <>
          <h2 className="test-title">{dimension.title}</h2>
          <p className="test-description">{dimension.intro}</p>
          <button className="test-button" onClick={() => setPhase("question")}>დაწყება</button>
        </>
      )}

      {phase === "question" && currentQuestion && (
        <>
          <p className="question-counter">
            კითხვა {currentIndex + 1} / {questions.length}
          </p>

          <p className="question-text">{currentQuestion.text}</p>

          <div className="answer-buttons">
            <button onClick={() => handleAnswer(currentQuestion.a.value)}>
              {currentQuestion.a.text}
            </button>
            <button onClick={() => handleAnswer(currentQuestion.b.value)}>
              {currentQuestion.b.text}
            </button>
        </div>
      </>
    )}


      {phase === "result" && (
        <>
          <img className="result-image" src={`/images/${finalResult}.png`} alt={finalResult} />
          <p className="test-description">{dimension.descriptions[finalResult]}</p>
          <button className="test-button" onClick={() => onComplete(finalResult)}>განაგრძე →</button>
        </>
      )}
    </div>
  );
}
