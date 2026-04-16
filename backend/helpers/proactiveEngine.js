// helpers/proactiveEngine.js

const proactiveQuestions = {
  INTJ: "რა გრძელვადიან მიზანზე ფიქრობ ახლა?",
  INTP: "რა იდეები გაწუხებს ბოლო დროს?",
  ENTJ: "რომელი მიზნის მიღწევა გინდა პირველ რიგში?",
  ENTP: "გაქვს ახალი იდეები ბოლო დროს?",

  INFJ: "რა თემაზე ფიქრს უღრმავდები და გინდა გამიზიარო?",
  INFP: "რა არის შენი შთაგონების წყარო?",
  ENFJ: "ვის დახმარებას ცდილობ ამ პერიოდში?",
  ENFP: "რა გინდა სცადო ახალი?",

  ISTJ: "რა გეგმაზე მუშაობ ახლა?",
  ISFJ: "რა გინდა გააუმჯობესო ყოველდღიურობაში?",
  ESTJ: "რა ამოცანა გაქვს გადასაწყვეტი?",
  ESFJ: "როგორ მიდის შენი ურთიერთობები?",

  ISTP: "რა პრობლემის გადაჭრას ცდილობ?",
  ISFP: "რაში პოულობ სიმშვიდეს?",
  ESTP: "რა მოქმედებაზე ფიქრობ?",
  ESFP: "რა მოხდა დღეს საინტერესო?"
};

export function shouldTriggerProactive(memory) {
  const now = Date.now();
  const last = memory.lastInteraction || 0;

  const diffMinutes = (now - last) / 60000;

  return (
    diffMinutes > 20 ||          // დრო გავიდა
    (memory.thinkingLevel || 0) > 0.6 // deep mode
  );
}

export function buildProactiveMessage(mbti, memory) {
  const question =
    proactiveQuestions[mbti] || "როგორ მიდის შენი დღე?";

  if (memory?.goals?.length) {
    const lastGoal = memory.goals[memory.goals.length - 1];
    return `შენი ბოლო მიზანი იყო: "${lastGoal}". ${question}`;
  }

  return question;
}

export function updateLastInteraction(memory) {
  memory.lastInteraction = Date.now();
  return memory;
}