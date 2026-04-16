import React, { useEffect } from "react";
import "./test.css";

export default function Processing({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 1200);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="test-card">
      <p className="test-description">მონაცემები მუშავდება...</p>
      <div className="spinner" style={{ marginTop: "20px" }}></div>
    </div>
  );
}
