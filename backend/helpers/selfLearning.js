export function updateLearning(memory, message = "") {
  if (!memory) return memory;

  memory.interests = memory.interests || [];

  const words = message
    .toLowerCase()
    .replace(/[^\w\s\u10A0-\u10FF]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 4);

  const keywords = words.slice(0, 3);

  keywords.forEach(word => {
    if (!memory.interests.includes(word)) {
      memory.interests.push(word);
    }
  });

  memory.interests = memory.interests.slice(-15);

  return memory;
}


export function buildLearningContext(memory) {
  if (!memory?.interests?.length) return "";

  return `
User interests detected:
${memory.interests.slice(-5).join(", ")}

If relevant, relate answers to these interests.
`;
}