import React from "react";
import "./test.css";

export default function DimensionIntro({ dimension, onStart }) {
  return (
    <div className="test-card">
      <h2 className="test-title">{dimension.title}</h2>
      <p className="test-description">{dimension.intro}</p>
      <button className="test-button" onClick={onStart}>
        დაიწყე ტესტი →
      </button>
    </div>
  );
}
