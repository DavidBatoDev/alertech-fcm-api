const express = require('express');
const admin = require('firebase-admin');
const app = express();
app.use(express.json());  // For parsing JSON requests

// Load Service Account from Vercel Environment Variables
const serviceAccountBase64 = process.env.FIREBASE_CREDENTIALS;
const serviceAccount = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString('utf-8'));

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Root Route
app.get('/', (req, res) => {
  res.send('FCM Express API is up and running!');
});

// Send Notification to a Topic
app.post('/sendTopicNotification', async (req, res) => {
  // You can send these values in the request body, or use defaults.
  const {
    title = 'Fire Detected!',
    body = 'Fire Detected in PUP Sta. Mesa Room 101',
    sound_type = 'alarm_sound',  // Should match a file in res/raw (e.g., alarm_sound.mp3)
    imageUrl = ''
  } = req.body;

  const message = {
    topic: 'all',
    data: {
      type: 'alarm',
      title: title,
      body: body,
      sound_type: sound_type,
      imageUrl: imageUrl
    },
    android: {
      priority: 'high'
    }
  };

  try {
    const response = await admin.messaging().send(message);
    res.json({ success: true, response });
  } catch (err) {
    console.error('Error sending topic notification:', err);
    res.status(500).json({ error: 'Failed to send topic notification' });
  }
});

// Send Notification to Specific Device (by topic for now)
app.post('/sendDeviceNotification', async (req, res) => {
  // Expecting topic, title, body, sound_type, imageUrl in request body.
  const {
    topic,
    title = 'Fire Detected!',
    body = 'Fire Detected in PUP Sta. Mesa Room 101',
    sound_type = 'alarm_sound',
    imageUrl = ''
  } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'topic is required!' });
  }

  const message = {
    topic: topic,
    data: {
      type: 'alarm',
      title: title,
      body: body,
      sound_type: sound_type,
      imageUrl: imageUrl
    },
    android: {
      priority: 'high'
    }
  };

  try {
    const response = await admin.messaging().send(message);
    res.json({ success: true, response });
  } catch (err) {
    console.error('Error sending device notification:', err);
    res.status(500).json({ error: 'Failed to send device notification' });
  }
});

// Export for Vercel
module.exports = app;
