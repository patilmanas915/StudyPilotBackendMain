/**
 * GET /api/health
 * Health check endpoint for monitoring.
 */
export default function handler(req, res) {
  res.status(200).json({
    status: "ok",
    service: "StudyPilot Backend",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
}
