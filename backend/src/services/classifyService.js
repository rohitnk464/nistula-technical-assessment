const { QUERY_TYPES } = require('../config/constants');

/**
 * Classifies guest intent using rule-based keyword matching.
 * 
 * @param {string} messageText 
 * @returns {string} query_type
 */
function classifyIntent(messageText) {
  if (!messageText) return QUERY_TYPES.GENERAL_ENQUIRY;

  const text = messageText.toLowerCase();

  // Rules are evaluated in order. Complaint MUST override everything.
  const rules = [
    {
      intent: QUERY_TYPES.COMPLAINT,
      keywords: [
        "not working", "broken", "issue", "problem", "refund", "unhappy", 
        "bad", "terrible", "dirty", "poor", "complaint", "angry", 
        "disappointed", "no hot water", "wifi not working", "ac not working"
      ]
    },
    {
      intent: QUERY_TYPES.PRE_SALES_PRICING,
      keywords: ['rate', 'price', 'cost', 'discount', 'how much']
    },
    {
      intent: QUERY_TYPES.PRE_SALES_AVAILABILITY,
      keywords: ['available', 'vacancy', 'book', 'dates', 'free', 'open']
    },
    {
      intent: QUERY_TYPES.SPECIAL_REQUEST,
      keywords: ['airport', 'transfer', 'pickup', 'early', 'late', 'extra bed', 'wheelchair', 'dietary']
    },
    {
      intent: QUERY_TYPES.POST_SALES_CHECKIN,
      keywords: ['wifi', 'checkin', 'check-in', 'checkout', 'check-out', 'password', 'key', 'location', 'directions']
    }
  ];

  for (const rule of rules) {
    if (rule.keywords.some(keyword => text.includes(keyword))) {
      return rule.intent;
    }
  }

  return QUERY_TYPES.GENERAL_ENQUIRY;
}

module.exports = { classifyIntent };
