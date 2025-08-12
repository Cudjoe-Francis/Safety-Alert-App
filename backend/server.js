const express = require("express");
const africastalking = require("africastalking");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Replace with your Africa's Talking credentials
const AT = africastalking({
  apiKey: "atsk_80f64ca8c2d96e6596f32f9cde7643d7f7c8bba731880b6f6cc980c34729c086e54589b3",
  username: "sandbox",
});

const sms = AT.SMS;

app.post("/send-sos", async (req, res) => {
  const { contacts, message } = req.body;
  if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
    return res.status(400).json({ error: "No contacts provided" });
  }

  // Extract phone numbers
  const to = contacts.map((c) => c.phone);

  try {
    const result = await sms.send({
      to,
      message,
      from: "AFRICASTKNG", // Use your approved sender ID or leave as default for sandbox
    });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
