const { CONFIDENCE, QUERY_TYPES, ACTIONS } = require('../config/constants');

/**
 * Generates a confidence score based on the query type and message content.
 * 
 * @param {string} queryType 
 * @param {string} messageText 
 * @returns {number} confidence score
 */
function calculateConfidence(queryType, messageText) {
  let score = 0.5;

  switch (queryType) {
    case QUERY_TYPES.PRE_SALES_AVAILABILITY:
      score = 0.92;
      break;
    case QUERY_TYPES.PRE_SALES_PRICING:
      score = 0.88;
      break;
    case QUERY_TYPES.GENERAL_ENQUIRY:
      score = 0.82;
      break;
    case QUERY_TYPES.POST_SALES_CHECKIN:
    case QUERY_TYPES.SPECIAL_REQUEST:
      score = 0.80;
      break;
    case QUERY_TYPES.COMPLAINT:
      score = 0.45;
      break;
    default:
      score = 0.65;
  }

  // Adjust for ambiguity based on length (very short messages might be ambiguous)
  if (messageText.length < 10 && queryType === QUERY_TYPES.GENERAL_ENQUIRY) {
    score = 0.55; // Lowered to push to escalate if too short
  }

  return score;
}

/**
 * Determines workflow action based on confidence score.
 * 
 * @param {number} confidenceScore 
 * @param {string} queryType 
 * @returns {string} action
 */
function determineAction(confidenceScore, queryType) {
  if (queryType === QUERY_TYPES.COMPLAINT) {
    return ACTIONS.ESCALATE;
  }

  if (confidenceScore >= CONFIDENCE.AUTO_SEND) {
    return ACTIONS.AUTO_SEND;
  } else if (confidenceScore >= CONFIDENCE.AGENT_REVIEW && confidenceScore < CONFIDENCE.AUTO_SEND) {
    return ACTIONS.AGENT_REVIEW;
  } else {
    return ACTIONS.ESCALATE;
  }
}

module.exports = { calculateConfidence, determineAction };
