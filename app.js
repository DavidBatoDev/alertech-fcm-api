const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(express.json());

// Route to send notification to a specific token
app.post('/sendNotification/:token', async (req, res) => {
  const token = req.params.token;
  
  // You can optionally allow dynamic title/body via req.body
  const { title = 'Test Alarm', body = 'This is a test alarm via FCM v1' } = req.body;

  const message = {
    token: token,
    notification: {
      title: title,
      body: body,
    },
    data: {
      type: 'alarm'
    },
    android: {
      notification: {
        channel_id: 'alarm_channel',
        sound: 'alarm_sound'
      }
    }
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Notification sent successfully:', response);
    res.status(200).json({ message: 'Notification sent successfully', response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Error sending notification', error });
  }
});

// Route to send notification to all devices subscribed to "all" topic
app.post('/sendNotificationToAll', async (req, res) => {
  // Optionally allow dynamic title/body via req.body
  const { title = 'Fire Detected', body = 'Fire Detected in PUP Sta. Mesa Room 101' } = req.body;

  const message = {
    topic: 'all', 
    notification: {
      title: title,
      body: body
    },
    data: {
      type: 'alarm'
    },
    android: {
      notification: {
        channel_id: 'alarm_channel',
        sound: 'alarm_sound'
      }
    }
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Notification sent successfully:', response);
    res.status(200).json({ message: 'Notification sent successfully', response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Error sending notification', error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
