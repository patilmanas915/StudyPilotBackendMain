const { askQuestion } = require("../../lib/gemini");
const { checkRateLimit } = require("../../utils/rateLimiter");
const { validateBody, sanitizeString } = require("../../utils/validator");

/**
 * POST /api/ask-ai
 * Body: { "question": "...", "userId": "..." }
 * Response: { "answer": "..." }
 */
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limit
  if (!checkRateLimit(req, res)) return;

  // Validate
  const { valid, missing } = validateBody(req.body, ["question"]);
  if (!valid) {
    return res
      .status(400)
      .json({ error: `Missing required fields: ${missing.join(", ")}` });
  }

  const question = sanitizeString(req.body.question, 2000);
  if (question.length < 3) {
    return res
      .status(400)
      .json({ error: "Question must be at least 3 characters" });
  }

  try {
    const answer = await askQuestion(question);
    return res.status(200).json({ answer });
  } catch (error) {
    console.error("[ask-ai] Error:", error.message);
    return res.status(500).json({
      error: "Failed to generate response. Please try again.",
    });
  }
}
