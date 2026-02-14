const { getDailyQuote } = require("../../lib/gemini");
const { checkRateLimit } = require("../../utils/rateLimiter");

// In-memory cache for daily quote (refreshes every hour)
let cachedQuote = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * GET /api/quote
 * Response: { "quote": "...", "author": "..." }
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!checkRateLimit(req, res)) return;

  try {
    const now = Date.now();
    if (cachedQuote && now - cacheTimestamp < CACHE_TTL) {
      return res.status(200).json(cachedQuote);
    }

    const quote = await getDailyQuote();
    cachedQuote = quote;
    cacheTimestamp = now;

    return res.status(200).json(quote);
  } catch (error) {
    console.error("[quote] Error:", error.message);

    // Return fallback quote on error
    return res.status(200).json({
      quote: "The secret of getting ahead is getting started.",
      author: "Mark Twain",
    });
  }
}
