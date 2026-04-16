
// helpers/humorEngine.js
export function addHumor(text, state){

  if(state.mode === "friendly"){
    return text + "\n\n😄 ხანდახან საუკეთესო იდეები უბრალოდ მცდელობებიდან იწყება.";
  }

  if(state.mode === "strategist"){
    return text + "\n\n🚀 კარგი სტრატეგია უკვე ნახევარი გზაა გამარჯვებისთვის.";
  }

  if(state.emotionalState === "low"){
    return text + "\n\n🙂 და გახსოვდეს — ყველა რთული ეტაპი დროებითია.";
  }

  return text;
}