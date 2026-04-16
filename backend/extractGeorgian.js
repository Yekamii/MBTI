
// extractGeorgian.js
import fs from "fs";
import readline from "readline";

const inputFile = "./data/sentences.csv";
const outputFile = "./data/georgian_sentences.json";

async function extractGeorgian() {
  const fileStream = fs.createReadStream(inputFile);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const georgianSentences = [];

  for await (const line of rl) {
    // CSV-ის ფაილში შეიძლება ";" ან "," გამოყენებული იყოს
    const columns = line.split("\t"); // Tatoeba export uses tab
    const sentence = columns[2] || ""; // Tatoeba: columns[2] = actual sentence
    const language = columns[1] || ""; // columns[1] = language code

    // მხოლოდ ქართული წინადადებები
    if (language === "ka" && sentence.trim().length > 5) {
      georgianSentences.push(sentence.trim());
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(georgianSentences, null, 2));
  console.log(`ფილტრირებული ქართული წინადადებები შენახულია: ${outputFile}`);
}

extractGeorgian();