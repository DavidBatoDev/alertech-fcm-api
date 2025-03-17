# Fire Alert Notification System
This repository is a lightweight backend service built with Express.js that leverages Firebase Cloud Messaging (FCM) to deliver real-time notifications. Designed for rapid and reliable alerting, it allows you to send notifications either to a specific device by its FCM token or to all devices subscribed to a designated topic.

## Prerequesites
- serviceAccountKey.json (from service account admin firebase)

## Usage
### Install the libraries first
```bash
npm install
```

### 1. Run the server
```bash
node app.js
```

### 2. Test the API (curl or API testing)
#### Sending a notification to specific device
```bash
curl -X POST http://localhost:3000/sendNotification/your_device_token -H "Content-Type: application/json" -d '{"title": "Fire Detected", "body": "Room Temp Exceeded threshold"}'
```

#### Sending a notification to all device
```bash
curl -X POST http://localhost:3000/sendNotificationToAll -H "Content-Type: application/json" -d '{"title": "Fire Alert!", "body": "Fire Detected at St. 123"}'
```

