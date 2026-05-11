const { normalizeMessage } = require('../utils/normalizeMessage');
const { classifyIntent } = require('../services/classifyService');
const { calculateConfidence, determineAction } = require('../services/confidenceService');
const { generateResponse } = require('../services/claudeService');
const db = require('../utils/db');

const SUPPORTED_SOURCES = ['whatsapp', 'booking_com', 'airbnb', 'instagram', 'direct'];

/**
 * Validates the incoming webhook payload based on PRD requirements.
 * @param {Object} payload 
 * @returns {string|null} Error message or null if valid
 */
function validatePayload(payload) {
  if (!payload.source || !SUPPORTED_SOURCES.includes(payload.source)) {
    return "Invalid or unsupported source type";
  }
  if (!payload.message || typeof payload.message !== 'string' || payload.message.trim() === '') {
    return "Message cannot be empty";
  }
  if (payload.message.length > 1000) {
    return "Message too long";
  }
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
  if (!payload.timestamp || !isoRegex.test(payload.timestamp)) {
    return "Invalid timestamp format. Must be ISO-8601 (e.g., 2026-05-05T10:30:00Z)";
  }
  if (!payload.property_id) return "property_id is required";
  
  return null;
}

/**
 * Handles the incoming webhook POST request.
 */
exports.handleIncomingMessage = async (req, res) => {
  try {
    const payload = req.body;

    // 1. Validation
    const validationError = validatePayload(payload);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // 2. Normalization
    const normalizedMessage = normalizeMessage(payload);

    // 3. Classification
    const queryType = classifyIntent(normalizedMessage.message_text);
    normalizedMessage.query_type = queryType; // Adding to normalized message

    // 4. Claude API Integration
    let draftedReply = "";
    try {
      draftedReply = await generateResponse(normalizedMessage);
    } catch (apiError) {
      // Handle Claude API downtime or failures gracefully
      draftedReply = "We are currently experiencing high volume. A team member will respond shortly.";
      console.error(apiError);
      // We might want to force escalation on API failure
    }

    // 5. Confidence Scoring & Workflow Action
    const confidenceScore = calculateConfidence(queryType, normalizedMessage.message_text);
    const action = determineAction(confidenceScore, queryType);

    // 6. Database Insertion
    try {
      // NOTE: In a real implementation we would execute the full transaction.
      // await saveMessage(normalizedMessage);
      
      // Simulating a DB call that could fail
      console.log('Database operations skipped for demonstration. See schema.sql for design.');
    } catch (dbError) {
      console.error('Database insertion error:', dbError);
      return res.status(503).json({ error: "Database unavailable" });
    }

    // 7. Structured Logging
    console.log({
      event: "message_received",
      source: payload.source,
      query_type: queryType,
      action: action,
      confidence: confidenceScore
    });

    // 8. Final API Response
    const finalResponse = {
      message_id: normalizedMessage.message_id,
      query_type: queryType,
      drafted_reply: draftedReply,
      confidence_score: confidenceScore,
      action: action
    };

    return res.status(200).json(finalResponse);

  } catch (error) {
    console.error("Error handling message:", error);
    return res.status(500).json({ error: "Internal server error processing message" });
  }
};
