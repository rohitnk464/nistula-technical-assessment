

async function runTests() {
  const url = 'http://localhost:5000/webhook/message';

  const inputs = [
    {
      name: "Input 1: Availability Query",
      payload: {
        "source": "whatsapp",
        "guest_name": "Rahul Sharma",
        "message": "Is the villa available from April 20 to 24? What is the rate for 2 adults?",
        "timestamp": "2026-05-05T10:30:00Z",
        "booking_ref": "NIS-2024-0891",
        "property_id": "villa-b1"
      }
    },
    {
      name: "Input 2: Complaint",
      payload: {
        "source": "airbnb",
        "guest_name": "Anita Desai",
        "message": "There is no hot water and we have guests arriving for breakfast in 4 hours. This is unacceptable. I want a refund for tonight.",
        "timestamp": "2026-05-05T03:00:00Z",
        "booking_ref": "NIS-2024-0892",
        "property_id": "villa-b1"
      }
    },
    {
      name: "Input 3: Post Sales Check-in",
      payload: {
        "source": "booking_com",
        "guest_name": "John Doe",
        "message": "Hi, what time can we check in today? And what is the WiFi password?",
        "timestamp": "2026-05-05T14:00:00Z",
        "booking_ref": "NIS-2024-0893",
        "property_id": "villa-b1"
      }
    }
  ];

  for (const input of inputs) {
    console.log(`\n--- Running ${input.name} ---`);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': 'super_secret_key_123'
        },
        body: JSON.stringify(input.payload)
      });
      const data = await response.json();
      console.log("Response Status:", response.status);
      console.log("Response Data:", JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("Test Error:", err.message);
    }
  }
}

runTests();
