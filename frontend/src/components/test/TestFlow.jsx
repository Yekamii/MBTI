import React, { useState } from "react";
import QuestionStep from "./QuestionStep";
import { dimensions } from "./testData";
import Processing from "./Processing";
import FinalResult from "./FinalResult";
import "./test.css";

export default function TestFlow() {
  const [currentDimension, setCurrentDimension] = useState(0);
  const [results, setResults] = useState({});
  const [phase, setPhase] = useState("intro");

  const handleDimensionComplete = (value) => {
    const key = dimensions[currentDimension].key;
    setResults((prev) => ({ ...prev, [key]: value }));

    if (currentDimension + 1 < dimensions.length) {
      setCurrentDimension(currentDimension + 1);
      setPhase("intro");
    } else {
      setPhase("processing");
    }
  };

  if (phase === "processing") {
    return (
      <div className="test-page">
        <Processing onDone={() => setPhase("final")} />
      </div>
    );
  }

  if (phase === "final") {
    return (
      <div className="test-page">
        <FinalResult results={results} />
      </div>
    );
  }

  return (
    <div className="test-page">
      <QuestionStep
        key={dimensions[currentDimension].key}
        dimension={dimensions[currentDimension]}
        phase={phase}
        setPhase={setPhase}
        onComplete={handleDimensionComplete}
      />
    </div>
  );
}
