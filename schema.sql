-- Nistula AI-Powered Unified Guest Messaging Platform
-- PostgreSQL Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: guests
-- Stores unified guest identity
CREATE TABLE guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: reservations
-- Stores reservations linked to a guest
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    booking_ref VARCHAR(100) UNIQUE,
    property_id VARCHAR(100),
    check_in DATE,
    check_out DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: conversations
-- Group messages under a logical conversation thread per guest and reservation
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
    channel VARCHAR(50) NOT NULL, -- e.g., whatsapp, airbnb
    status VARCHAR(50) DEFAULT 'open', -- open, closed, escalated
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: messages
-- Stores incoming messages and system replies
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    source VARCHAR(50) NOT NULL, -- whatsapp, booking_com, airbnb, instagram, direct
    message_text TEXT NOT NULL,
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    channel_timestamp TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: ai_responses
-- Stores AI drafted replies, intents, confidence, and action taken
CREATE TABLE ai_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    query_type VARCHAR(100) NOT NULL,
    drafted_reply TEXT NOT NULL,
    confidence_score NUMERIC(3, 2) NOT NULL,
    action_taken VARCHAR(50) NOT NULL, -- auto_send, agent_review, escalate
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_reservations_booking_ref ON reservations(booking_ref);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_ai_responses_message_id ON ai_responses(message_id);

/*
DESIGN DECISIONS & HARDEST DECISION:

The schema was designed to enforce referential integrity across the fragmented hospitality ecosystem.
Guests are unified at the root (`guests` table), while `reservations` act as a contextual bridge to `conversations`.
Each `message` belongs to a conversation, allowing context to be built linearly, and `ai_responses` are tied directly to the inbound message they address.

Hardest Design Decision:
The hardest decision was deciding how to model the relationship between `messages`, `conversations`, and `reservations`. 
Initially, I considered tying messages directly to reservations. However, guests often send pre-sales queries before a reservation exists. 
To solve this, I introduced the `conversations` table as the central anchor for all messaging. A conversation requires a `guest_id` but allows `reservation_id` to be NULL. 
This elegantly handles both pre-sales inquiries (no reservation) and post-sales support (linked reservation) within the exact same chat thread logic, preventing schema fragmentation.
*/
