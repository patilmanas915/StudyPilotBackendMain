const { checkRateLimit } = require("../../../utils/rateLimiter");
const { validateBody } = require("../../../utils/validator");

/**
 * POST /api/analytics/upload
 * Body: { "userId": "...", "totalStudyMinutes": 120, "sessionsCompleted": 5, ... }
 * Response: { "success": true, "message": "..." }
 *
 * NOTE: In production, this would persist to a database (Firestore, Postgres, etc.)
 * For now this is a stub that validates and acknowledges the upload.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!checkRateLimit(req, res)) return;

  const { valid, missing } = validateBody(req.body, ["userId"]);
  if (!valid) {
    return res
      .status(400)
      .json({ error: `Missing required fields: ${missing.join(", ")}` });
  }

  try {
    // Log analytics (in production: save to DB)
    console.log("[analytics] Upload from user:", req.body.userId, {
      totalStudyMinutes: req.body.totalStudyMinutes,
      sessionsCompleted: req.body.sessionsCompleted,
      streakDays: req.body.streakDays,
    });

    return res.status(200).json({
      success: true,
      message: "Analytics uploaded successfully",
    });
  } catch (error) {
    console.error("[analytics/upload] Error:", error.message);
    return res.status(500).json({
      error: "Failed to upload analytics.",
    });
  }
}
