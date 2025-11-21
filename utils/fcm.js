const axios = require("axios");

exports.sendToDevice = async (token, payload) => {
  const serverKey = process.env.FCM_SERVER_KEY;

  await axios.post(
    "https://fcm.googleapis.com/fcm/send",
    {
      to: token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {},
    },
    {
      headers: {
        Authorization: `key=${serverKey}`,
        "Content-Type": "application/json",
      },
    }
  );
};
