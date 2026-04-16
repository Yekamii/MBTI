import { useEffect, useState } from "react";
import { fetchPubMedResearch } from "../services/pubmedService";
import "./ResearchTicker.css";

export default function ResearchTicker() {
  const [research, setResearch] = useState([]);

  useEffect(() => {
    fetchPubMedResearch()
      .then(setResearch)
      .catch((err) => console.error("PubMed error:", err));
  }, []);

  if (!research.length) {
    return (
      <div className="research-ticker-wrapper">
        <div className="research-ticker">
          <span>Research preview:</span>
          <div className="ticker-scroll">Loading research preview...</div>
        </div>
      </div>
    );
  }

  const doubled = [...research, ...research];

  return (
    <div className="research-ticker-wrapper">
      <div className="research-ticker">
        <span>Research preview:</span>
        <div className="ticker-scroll">
          {doubled.map((item, index) => (
            <a key={index} href={item.link} target="_blank" rel="noreferrer">
              • {item.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
