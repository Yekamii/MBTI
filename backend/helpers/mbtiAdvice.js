// helpers/mbtiAdvice.js

const MBTI_TYPES = {
  // ================= NT (Strategists) =================

  INTJ: {
    description: "სტრატეგი, ანალიტიკური და დამოუკიდებელი.",
    tone: "analytical",
    energy: "low",
    structure: "high",
    advice: [
      "დიდი მიზნები დაყავი სისტემურ ეტაპებად.",
      "გააკონტროლე გადაჭარბებული პერფექციონიზმი.",
      "იმუშავე იდეების სწრაფ განხორციელებაზე."
    ]
  },

  INTP: {
    description: "იდეების მკვლევარი და თეორიული ანალიტიკოსი.",
    tone: "conceptual",
    energy: "low",
    structure: "medium",
    advice: [
      "გადადი ფიქრიდან მოქმედებაზე.",
      "შეამოწმე იდეები რეალურ სამყაროში.",
      "არ დაიკარგო უსასრულო ანალიზში."
    ]
  },

  ENTJ: {
    description: "მიზანზე ორიენტირებული ლიდერი.",
    tone: "direct",
    energy: "high",
    structure: "high",
    advice: [
      "განსაზღვრე მკაფიო სტრატეგია.",
      "დელეგირება ლიდერობის ნაწილია.",
      "გააკეთე შედეგზე ორიენტირებული გადაწყვეტილებები."
    ]
  },

  ENTP: {
    description: "ინოვატორი და დებატების ოსტატი.",
    tone: "energetic",
    energy: "high",
    structure: "low",
    advice: [
      "აირჩიე ერთი იდეა და ბოლომდე მიიყვანე.",
      "დაბალანსე სპონტანურობა სტრუქტურით.",
      "კონცენტრირდი პრაქტიკულ განხორციელებაზე."
    ]
  },

  // ================= NF (Idealists) =================

  INFJ: {
    description: "ღრმა ხედვის მქონე ემპათიური სტრატეგი.",
    tone: "deep",
    energy: "medium",
    structure: "high",
    advice: [
      "არ დაივიწყო საკუთარი საზღვრები.",
      "დაყავი დიდი იდეები მცირე ნაბიჯებად.",
      "არ აიღო ზედმეტი პასუხისმგებლობა."
    ]
  },

  INFP: {
    description: "იდეალისტი, ღირებულებებზე ორიენტირებული.",
    tone: "deep",
    energy: "low",
    structure: "low",
    advice: [
      "შეინარჩუნე კავშირი რეალურ მოქმედებასთან.",
      "დაამატე სტრუქტურა შთაგონებას.",
      "ნუ გადადებ მნიშვნელოვან გადაწყვეტილებებს."
    ]
  },

  ENFJ: {
    description: "ინსპირაციული ლიდერი და მენტორი.",
    tone: "warm",
    energy: "high",
    structure: "medium",
    advice: [
      "არ დაივიწყო საკუთარი საჭიროებები.",
      "გაანაწილე ემოციური ენერგია სწორად.",
      "განსაზღვრე საზღვრები."
    ]
  },

  ENFP: {
    description: "ენერგიული ინოვატორი და მოტივატორი.",
    tone: "energetic",
    energy: "high",
    structure: "low",
    advice: [
      "დაასრულე დაწყებული საქმეები.",
      "ფოკუსირდი ერთ მიმართულებაზე.",
      "იდეებს დაუმატე პრაქტიკული გეგმა."
    ]
  },

  // ================= SJ (Guardians) =================

  ISTJ: {
    description: "სისტემური და პასუხისმგებელი შემსრულებელი.",
    tone: "direct",
    energy: "medium",
    structure: "high",
    advice: [
      "გაანაწილე სამუშაო პრიორიტეტებით.",
      "დაიტოვე სივრცე მოქნილობისთვის.",
      "არ აიღო ზედმეტი ტვირთი."
    ]
  },

  ISFJ: {
    description: "მზრუნველი და დეტალებზე ორიენტირებული.",
    tone: "warm",
    energy: "low",
    structure: "high",
    advice: [
      "დააყენე საკუთარი საჭიროებები პრიორიტეტში.",
      "არ თქვა 'კი' ყველაფერზე.",
      "გაანაწილე პასუხისმგებლობა."
    ]
  },

  ESTJ: {
    description: "ორგანიზებული და შედეგზე ორიენტირებული მენეჯერი.",
    tone: "direct",
    energy: "high",
    structure: "high",
    advice: [
      "გაამარტივე პროცესები.",
      "მოუსმინე განსხვავებულ აზრებს.",
      "შეამცირე ზედმეტი კონტროლი."
    ]
  },

  ESFJ: {
    description: "სოციალური და მხარდამჭერი ორგანიზატორი.",
    tone: "warm",
    energy: "high",
    structure: "medium",
    advice: [
      "ნუ აიღებ ყველას პრობლემას საკუთარ თავზე.",
      "განსაზღვრე პირადი საზღვრები.",
      "დაისვენე დროულად."
    ]
  },

  // ================= SP (Explorers) =================

  ISTP: {
    description: "პრაქტიკული პრობლემის გადამჭრელი.",
    tone: "analytical",
    energy: "medium",
    structure: "low",
    advice: [
      "დაგეგმე სანამ იმოქმედებ.",
      "გაუზიარე აზრები სხვებს.",
      "ნუ გადადებ კომუნიკაციას."
    ]
  },

  ISFP: {
    description: "შემოქმედებითი და დამოუკიდებელი.",
    tone: "deep",
    energy: "low",
    structure: "low",
    advice: [
      "დაამატე სტრუქტურა შთაგონებას.",
      "გამოხატე აზრები ხმამაღლა.",
      "არ დაიკარგო მარტოობაში."
    ]
  },

  ESTP: {
    description: "მოქმედებაზე ორიენტირებული და სწრაფი.",
    tone: "energetic",
    energy: "high",
    structure: "low",
    advice: [
      "იფიქრე გრძელვადიან შედეგებზე.",
      "დაამატე მცირე დაგეგმვა.",
      "არ იმოქმედო იმპულსურად."
    ]
  },

  ESFP: {
    description: "სოციალური და სპონტანური შემსრულებელი.",
    tone: "energetic",
    energy: "high",
    structure: "low",
    advice: [
      "დაამატე სტრუქტურა ყოველდღიურობას.",
      "ფოკუსირდი პრიორიტეტებზე.",
      "დაგეგმე მნიშვნელოვანი ნაბიჯები."
    ]
  }
};

// Default fallback
const DEFAULT_PROFILE = {
  description: "პერსონალური განვითარებაზე ორიენტირებული ადამიანი.",
  tone: "friendly",
  energy: "medium",
  structure: "medium",
  advice: ["დაიწყე მცირე ნაბიჯით და შეაფასე შედეგი."]
};

export function getMBTIAdvice(type) {
  if (!type || !MBTI_TYPES[type]) {
    return {
      exists: false,
      message:
        "შენ ჯერ არ გაქვს შენახული ფსიქოტიპი. შეგიძლია გაიარო ტესტი და შეინახო, რომ ჩატი უფრო პერსონალურად მოგმართოს."
    };
  }

  const data = MBTI_TYPES[type] || DEFAULT_PROFILE;

  const randomAdvice =
    data.advice[Math.floor(Math.random() * data.advice.length)];

  return {
    exists: true,
    type,
    description: data.description,
    tone: data.tone,
    energy: data.energy,
    structure: data.structure,
    advice: randomAdvice
  };
}