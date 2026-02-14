const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;
let model = null;

function getModel() {
  if (!model) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      throw new Error("GEMINI_API_KEY is not configured. Set it in .env.local");
    }
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }
  return model;
}

/**
 * Ask Gemini a study-related question.
 * @param {string} question
 * @returns {Promise<string>} The AI answer
 */
async function askQuestion(question) {
  const gemini = getModel();
  const prompt = `You are StudyPilot AI, a helpful academic tutor. Answer the following study question clearly and concisely. If the question is not study-related, politely redirect the user to ask academic questions.\n\nQuestion: ${question}`;

  const result = await gemini.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

/**
 * Generate flashcards for a given topic.
 * @param {string} topic
 * @param {number} count
 * @returns {Promise<Array<{question: string, answer: string}>>}
 */
async function generateFlashcards(topic, count = 5) {
  const gemini = getModel();
  const prompt = `Generate exactly ${count} flashcards for studying the topic: "${topic}".

Return ONLY valid JSON — no markdown, no code fences, no explanation.
Format:
[
  { "question": "...", "answer": "..." }
]`;

  const result = await gemini.generateContent(prompt);
  const response = await result.response;
  const text = response.text().trim();

  // Strip any markdown code fences if present
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
}

/**
 * Get an inspirational study quote.
 * @returns {Promise<{quote: string, author: string}>}
 */
async function getDailyQuote() {
  const gemini = getModel();
  const prompt = `Generate one unique, inspiring quote about studying, learning, or education. Return ONLY valid JSON with no markdown:
{ "quote": "...", "author": "..." }
If it's an original quote, use "StudyPilot AI" as the author.`;

  const result = await gemini.generateContent(prompt);
  const response = await result.response;
  const text = response.text().trim();
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
}

module.exports = { askQuestion, generateFlashcards, getDailyQuote };
