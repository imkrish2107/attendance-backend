const axios = require('axios');

module.exports.sendPush = async (deviceToken, title, body) => {
  const FCM_SERVER_KEY = process.env.FCM_KEY;

  await axios.post(
    'https://fcm.googleapis.com/fcm/send',
    {
      to: deviceToken,
      notification: {
        title,
        body
      }
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${FCM_SERVER_KEY}`
      }
    }
  );
};
