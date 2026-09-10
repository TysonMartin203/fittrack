const path = require('path');
const fs   = require('fs');
const { savePhoto, getPhotos, deletePhoto } = require('../models/photo.model');

async function upload(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { photoDate } = req.body;
    if (!photoDate) return res.status(400).json({ error: 'photoDate required' });
    const filePath = `/uploads/${req.file.filename}`;
    const id = await savePhoto({ userId: req.userId, filePath, photoDate });
    res.status(201).json({ id, filePath, photoDate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function list(req, res) {
  try {
    const photos = await getPhotos(req.userId);
    res.json(photos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function remove(req, res) {
  try {
    const filePath = await deletePhoto(req.params.id, req.userId);
    if (!filePath) return res.status(404).json({ error: 'Not found' });
    const abs = path.join(__dirname, '..', 'public', filePath);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { upload, list, remove };
