// helpers/learningEngine.js
export function updateUserLearning(memory, message, aiReply){

  if(!memory.learning){
    memory.learning = {
      favoriteTopics: {},
      emotionalPatterns: {},
      questionTypes: {}
    };
  }

  const stopwords = [
    "არის","იყო","რომ","მაგრამ","და","თუ","რა","როგორ","რატომ",
    "მე","შენ","ის","ჩვენ","თქვენ","ისინი","კი","არა","ან"
  ];

  const words = message
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu,"")
    .split(/\s+/);

  words.forEach(word => {

    if(word.length > 3 && !stopwords.includes(word)){

      memory.learning.favoriteTopics[word] =
      (memory.learning.favoriteTopics[word] || 0) + 1;

    }

  });

  // decay system (ძველი თემები ნელა ქრება)
  for(const topic in memory.learning.favoriteTopics){

    memory.learning.favoriteTopics[topic] *= 0.97;

    if(memory.learning.favoriteTopics[topic] < 0.4){
      delete memory.learning.favoriteTopics[topic];
    }

  }

  // კითხვა თუ იყო
  if(message.includes("?")){

    memory.learning.questionTypes.questions =
    (memory.learning.questionTypes.questions || 0) + 1;

  }

  return memory;
}