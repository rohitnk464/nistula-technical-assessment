const { v4: uuidv4 } = require('uuid');

/**
 * Normalizes an incoming message payload into the unified internal schema.
 * @param {Object} payload 
 * @returns {Object} normalized message
 */
function normalizeMessage(payload) {
  return {
    message_id: uuidv4(),
    source: payload.source,
    guest_name: payload.guest_name,
    message_text: payload.message,
    timestamp: payload.timestamp,
    booking_ref: payload.booking_ref,
    property_id: payload.property_id
  };
}

module.exports = { normalizeMessage };
