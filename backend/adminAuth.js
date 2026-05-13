const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

require('dotenv').config();

const router = express.Router();

const username= process.env.USER_NAME;
const password = process.env.PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
const HASHED_SECRET = process.env.HASHED_SECRET;

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  secretKey: { type: String, required: true } 
});
const Admin = mongoose.model('Admin', adminSchema);



router.post('/setup', async (req, res) => {
  const adminExists = await Admin.findOne();
  if (adminExists) return res.status(400).json({ message: "Admin already exists!" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedSecret = await bcrypt.hash(HASHED_SECRET, 10);

  const newAdmin = new Admin({
    username: username,
    password: hashedPassword,
    secretKey: hashedSecret
  });

  await newAdmin.save();
  res.json({ message: "Admin created successfully!" });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: admin._id, role: "admin" }, JWT_SECRET, { expiresIn: "24h" });

  res.json({ success: true, token, username: admin.username });
});

router.post('/update-credentials', async (req, res) => {
  const { currentUsername, secretKey, newUsername, newPassword } = req.body;

  const admin = await Admin.findOne({ username: currentUsername });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const isKeyValid = await bcrypt.compare(secretKey, admin.secretKey);
  if (!isKeyValid) return res.status(403).json({ message: "Invalid Secret Key. Access Denied." });

  if (newUsername) admin.username = newUsername;
  if (newPassword) {
    admin.password = await bcrypt.hash(newPassword, 10);
  }

  await admin.save();
  res.json({ success: true, message: "Credentials updated successfully!" });
});

// 2. Initial Setup Route (Updated for a Clean Reset)
router.get('/setup', async (req, res) => {
  try {
    // This deletes the old admin so we can start fresh
    await Admin.deleteMany({}); 

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedSecret = await bcrypt.hash(HASHED_SECRET, 10);

    const newAdmin = new Admin({
      username: username,
      password: hashedPassword,
      secretKey: hashedSecret
    });

    await newAdmin.save();
    res.json({ 
      success: true, 
      message: "Admin Reset Successful!",
      loginDetails: {
        url: "http://localhost:3000/login",
        user: username,
        pass: password
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;