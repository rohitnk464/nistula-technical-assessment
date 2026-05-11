# Part 3 — Thinking Question

**Question A — The Immediate Response**
"I am so sorry to hear there is no hot water right now, especially with your guests arriving so soon. I have escalated this as an absolute emergency to the caretaker who is available at 8am, and flagged it for our property manager immediately. We completely understand your frustration and someone will be in touch with you first thing to resolve the issue and address your refund request."
*Reasoning*: The AI should acknowledge the urgency, show empathy, validate their frustration, set a clear expectation of when help will arrive (caretaker is 8am-10pm), and inform them the refund request has been noted for human review. It does not promise a refund, nor does it argue.

**Question B — The System Design**
Upon receiving this message, the webhook validates and classifies it as a `complaint`, setting the confidence score to `< 0.60` to force an `escalate` action. The message is persisted in PostgreSQL under `messages` with direction `inbound`.
Instead of just sending a message, the backend immediately triggers an urgent webhook to the property manager's communication channel (e.g., Slack or SMS via Twilio) flagged with high priority. A ticket is created in the operational dashboard. If no human responds within 30 minutes, an automated escalation path triggers, calling the on-call property manager's phone via a service like PagerDuty. The database logs the escalation timestamp and the subsequent human intervention to track SLA compliance.

**Question C — The Learning**
Pattern recognition is critical for hospitality operations. If the database logs a spike in `complaint` query types specifically tagged with "hot water" for Villa B1, the system should trigger a "Preventative Maintenance Alert" on the analytics dashboard.
To prevent this, I would build an anomaly detection cron job that groups complaints by `property_id` and semantic keywords. Once a threshold is breached (e.g., 3 hot water issues in 2 months), it automatically generates an unavoidable maintenance block on the booking calendar and assigns a mandatory inspection ticket to the plumbing vendor before any further guests can check in. This moves the system from reactive customer support to proactive property management.
