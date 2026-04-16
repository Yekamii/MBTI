// heplers/goalMemory.js
export function extractGoal(text = "") {
  const t = text.toLowerCase();

  const goalTriggers = [
    "მინდა",
    "მიზანი",
    "goal",
    "i want",
    "i plan",
    "ვსწავლობ",
    "დავიწყე"
  ];

  const isGoal = goalTriggers.some(word => t.includes(word));

  if (!isGoal) return null;

  return text.trim().slice(0, 120);
}


export function updateGoalMemory(memory, message) {
  if (!memory) return memory;

  memory.goals = memory.goals || [];

  const goal = extractGoal(message);

  if (goal && !memory.goals.includes(goal)) {
    memory.goals.push(goal);
  }

  memory.goals = memory.goals.slice(-10);

  return memory;
}

export function buildGoalReminder(memory) {
  if (!memory?.goals?.length) return "";

  const lastGoal = memory.goals[memory.goals.length - 1];

  return `
User long-term goal:
${lastGoal}

If relevant, encourage progress toward this goal.
`;
}