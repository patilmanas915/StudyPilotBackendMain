const { LRUCache } = require("lru-cache");

const rateLimitCache = new LRUCache({
  max: 500,
  ttl: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10), // 1 minute default
});

const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || "30", 10);

/**
 * Rate limiter middleware.
 * Returns true if the request is allowed, false if rate limited.
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 * @returns {boolean}
 */
function checkRateLimit(req, res) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  const key = `rate_${ip}`;
  const current = rateLimitCache.get(key) || 0;

  if (current >= MAX_REQUESTS) {
    res.status(429).json({
      error: "Too many requests. Please try again later.",
      retryAfter: Math.ceil(
        (rateLimitCache.getRemainingTTL(key) || 60000) / 1000
      ),
    });
    return false;
  }

  rateLimitCache.set(key, current + 1);

  // Set rate limit headers
  res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
  res.setHeader("X-RateLimit-Remaining", MAX_REQUESTS - current - 1);

  return true;
}

module.exports = { checkRateLimit };
