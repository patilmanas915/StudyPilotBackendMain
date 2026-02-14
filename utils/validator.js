/**
 * Validate that required fields are present in a request body.
 * @param {object} body
 * @param {string[]} requiredFields
 * @returns {{ valid: boolean, missing: string[] }}
 */
function validateBody(body, requiredFields) {
  const missing = requiredFields.filter(
    (field) => !body || body[field] === undefined || body[field] === null || body[field] === ""
  );
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Sanitize a string input — trim and limit length.
 * @param {string} input
 * @param {number} maxLength
 * @returns {string}
 */
function sanitizeString(input, maxLength = 2000) {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, maxLength);
}

module.exports = { validateBody, sanitizeString };
