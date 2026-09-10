const { sendMessage, getConversation } = require('../models/message.model');

async function send(req, res) {
  try {
    const { receiverId, message } = req.body;
    if (!receiverId || !message) return res.status(400).json({ error: 'receiverId and message required' });
    const id = await sendMessage({ senderId: req.userId, receiverId, message });
    res.status(201).json({ id });
  } catch (err) {
    if (err.message === 'Not friends') return res.status(403).json({ error: 'Not friends' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function conversation(req, res) {
  try {
    const messages = await getConversation(req.userId, req.params.friendId);
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { send, conversation };
