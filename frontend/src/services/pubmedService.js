
export async function fetchPubMedResearch() {

  const res = await fetch("http://localhost:5000/api/pubmed");
  if (!res.ok) throw new Error("Failed to fetch PubMed data");
  const data = await res.json();
  return data;
}
