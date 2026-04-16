import React, { useState, useEffect } from "react";

function MBTIOverview() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/mbti/overview")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <section>
      <h2>{data.title}</h2>
      <p>{data.content}</p>
    </section>
  );
}

export default MBTIOverview;
