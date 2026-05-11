/**
 * Mock database for property contexts.
 * In production, this would query the PostgreSQL database.
 */
const properties = {
  "villa-b1": {
    name: "Villa B1",
    location: "Assagao, North Goa",
    bedrooms: 3,
    max_guests: 6,
    private_pool: "Yes",
    check_in: "2pm",
    check_out: "11am",
    base_rate: "INR 18,000 per night (up to 4 guests)",
    extra_guest: "INR 2,000 per night per person",
    wifi: "Nistula@2024",
    caretaker_hours: "Available 8am to 10pm",
    chef_on_call: "Yes, pre-booking required",
    availability: "Available April 20-24",
    cancellation: "Free up to 7 days before check-in"
  }
};

/**
 * Fetches property context by ID.
 * @param {string} propertyId 
 * @returns {Object|null}
 */
function getPropertyContext(propertyId) {
  return properties[propertyId] || null;
}

/**
 * Formats the property object into a string for the AI prompt.
 * @param {Object} property 
 * @returns {string}
 */
function formatPropertyContext(property) {
  if (!property) return "Property details not found.";
  
  return `
Property: ${property.name}, ${property.location}
Bedrooms: ${property.bedrooms} | Max guests: ${property.max_guests} | Private pool: ${property.private_pool}
Check-in: ${property.check_in} | Check-out: ${property.check_out}
Base rate: ${property.base_rate}
Extra guest: ${property.extra_guest}
WiFi password: ${property.wifi}
Caretaker: ${property.caretaker_hours}
Chef on call: ${property.chef_on_call}
Availability: ${property.availability}
Cancellation: ${property.cancellation}
  `.trim();
}

module.exports = { getPropertyContext, formatPropertyContext };
