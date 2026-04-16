// helpers/emotionalEngine.js

export function detectMood(text = "") {
  const t = text.toLowerCase();

  if (
    t.includes("ვნერვიულობ") ||
    t.includes("მეშინია") ||
    t.includes("სტრესი") ||
    t.includes("ვღელავ") ||
    t.includes("დავიღალე")
  ) return "anxious";

  if (
    t.includes("ბედნიერი") ||
    t.includes("კარგად ვარ") ||
    t.includes("მიხარია") ||
    t.includes("მოტივირებული")
  ) return "positive";

  if (
    t.includes("არ ვიცი") ||
    t.includes("დაბნეული") ||
    t.includes("გაჭედილი")
  ) return "confused";

  if (
    t.includes("მოწყენილი") ||
    t.includes("ცუდად ვარ") ||
    t.includes("მინდა დავანებო")
  ) return "sad";

  return "neutral";
}

export function emotionalPrefix(mood) {
  switch (mood) {
    case "anxious":
      return "მესმის რომ სტრესში ხარ. მოდი მშვიდად ვიფიქროთ.";
    case "positive":
      return "მშვენიერია! ეს ენერგია გამოვიყენოთ.";
    case "confused":
      return "ნორმალურია დაბნეულობა. დავალაგოთ ნაბიჯებად.";
    case "sad":
      return "მესმის, ეს რთულია. ერთად ვნახოთ გამოსავალი.";
    default:
      return "";
  }
}