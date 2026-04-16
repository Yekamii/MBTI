// helpers/mbtiResponse.js
import { MBTI_GUIDANCE } from "./mbtiGuidance.js";

export function buildMBTIPrompt(type) {
  const data = MBTI_GUIDANCE[type];
  if (!data) return "";

  return `
MBTI personality guidance:

Communication style:
${data.style}

Focus areas:
${data.focus}

Always adapt explanations to this personality.
Reference MBTI traits naturally in conversation.
`;
}