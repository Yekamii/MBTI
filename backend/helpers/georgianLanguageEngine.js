
// helpers/georgianLanguageEngine.js
export async function improveGeorgian(text){

  if(!text) return "";

  let improved = text.trim();

  const fixes = {

    "რო ": "რომ ",
    "კაი": "კარგი",
    "ხო": "ჰო",
    "ძაან": "ძალიან",
    "რავი": "არ ვიცი",
    "ნუ ანუ": "ანუ",
    "მამენტ": "სინამდვილეში",

    "რა გაქვს თავში": "რაზე ფიქრობ",
    "იდეების გადმოსხმა": "იდეების გაზიარება",
    "არ ღირს თავი არ დაიწუხო": "არა უშავს",

    "რა გაქვს გეგმაში": "რას აპირებ",
    "რა ხდება შენს თავში": "რაზე ფიქრობ",
    "იდეები ცუდად გამოიყურება": "იდეები თავიდან უცნაურად შეიძლება ჟღერდეს",

    // ახალი fixes
    "როგორ შენ": "როგორ",
    "თუ შენ": "თუ",
    "როგორ შენ მიდის": "როგორ მიდის",
    "როგორ შენ მიდიხარ": "როგორ მიდიხარ",
    "შენ შეგიძლია რომ": "შეგიძლია",
    "შენ უნდა რომ": "უნდა",
    "მე ვფიქრობ რომ": "ვფიქრობ, რომ",
    "ეს ნიშნავს რომ": "ეს ნიშნავს, რომ"
  };

  for(const wrong in fixes){
    improved = improved.replaceAll(wrong, fixes[wrong]);
  }

  // remove duplicated sentences
  const sentences = improved.split(/(?<=[.!?])\s+/);
  const unique = [];
  sentences.forEach(s=>{
    if(!unique.includes(s)){
      unique.push(s);
    }
  });
  improved = unique.join(" ");

  // punctuation fixes
  improved = improved.replace(/([.!?])\1+/g, "$1");
  improved = improved.replace(/\s+/g," ");

  // capitalize first letter
  improved = improved.charAt(0).toUpperCase() + improved.slice(1);

  return improved.trim();
}