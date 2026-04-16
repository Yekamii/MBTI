// helpers/memorySelector.js
export function selectRelevantMemory(memory = {}, message = "", cognitive = {}, analysis = {}) {

  const text = message.toLowerCase();
  const selected = [];

  // Goal related memory
  if (
    cognitive.intent === "goal_related" ||
    text.includes("მიზანი") ||
    text.includes("გეგმა")
  ) {
    if (memory.goals?.length) {
      selected.push(`User goals: ${memory.goals.join(", ")}`);
    }
  }

  // Interest matching
  if (memory.interests?.length) {

    const match = memory.interests.find(i =>
      text.includes(i.toLowerCase())
    );

    if (match) {
      selected.push(`Relevant interest: ${match}`);
    }
  }

  // Emotional support memory
  if (analysis.emotionalState === "low") {
    selected.push(`Recent emotional tone: ${memory.lastTone || "neutral"}`);
  }

  if (selected.length === 0) {
    return "No relevant user memory.";
  }

  return selected.join("\n");
}