const { saveSubscription, removeSubscription, configured } = require('../models/push.model');
const { getNotifications, markRead, markAllRead } = require('../models/notification.model');

function vapidPublicKey(req, res) {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY || null, configured });
}

async function subscribe(req, res) {
  try {
    const { subscription } = req.body;
    if (!subscription?.endpoint || !subscription?.keys)
      return res.status(400).json({ error: 'Invalid subscription' });
    await saveSubscription(req.userId, subscription);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function unsubscribe(req, res) {
  try {
    const { endpoint } = req.body;
    if (endpoint) await removeSubscription(endpoint);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function list(req, res) {
  try {
    res.json(await getNotifications(req.userId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function read(req, res) {
  try {
    await markRead(req.params.id, req.userId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function readAll(req, res) {
  try {
    await markAllRead(req.userId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { vapidPublicKey, subscribe, unsubscribe, list, read, readAll };
