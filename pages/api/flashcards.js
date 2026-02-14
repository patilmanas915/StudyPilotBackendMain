const { generateFlashcards } = require("../../lib/gemini");
const { checkRateLimit } = require("../../utils/rateLimiter");
const { validateBody, sanitizeString } = require("../../utils/validator");

/**
 * POST /api/flashcards
 * Body: { "topic": "..." }
 * Response: { "flashcards": [{ "question": "...", "answer": "..." }] }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!checkRateLimit(req, res)) return;

  const { valid, missing } = validateBody(req.body, ["topic"]);
  if (!valid) {
    return res
      .status(400)
      .json({ error: `Missing required fields: ${missing.join(", ")}` });
  }

  const topic = sanitizeString(req.body.topic, 500);
  if (topic.length < 2) {
    return res
      .status(400)
      .json({ error: "Topic must be at least 2 characters" });
  }

  const count = Math.min(Math.max(parseInt(req.body.count) || 5, 1), 20);

  try {
    const flashcards = await generateFlashcards(topic, count);
    return res.status(200).json({ flashcards });
  } catch (error) {
    console.error("[flashcards] Error:", error.message);
    return res.status(500).json({
      error: "Failed to generate flashcards. Please try again.",
    });
  }
}
