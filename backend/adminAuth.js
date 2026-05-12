const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

require('dotenv').config();

const router = express.Router();

// ⚠️ Added fallback strings just in case Render environment variables are missing
// This prevents the server from crashing with a "data and salt required" error.
const username = process.env.USER_NAME || "admin";
const password = process.env.PASSWORD || "admin123";
const JWT_SECRET = process.env.JWT_SECRET || "fallback_jwt_secret";
const HASHED_SECRET = process.env.HASHED_SECRET || "fallback_hashed_secret";

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  secretKey: { type: String, required: true } 
});
const Admin = mongoose.model('Admin', adminSchema);

// Auto-create admin when the server starts
async function ensureDefaultAdmin() {
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedSecret = await bcrypt.hash(HASHED_SECRET, 10);

    const newAdmin = new Admin({
      username: username,
      password: hashedPassword,
      secretKey: hashedSecret
    });

    await newAdmin.save();
    console.log("✅ Default admin created:", username);
  }
}

// Trigger default admin creation once DB is connected
if (mongoose.connection.readyState === 1) {
  ensureDefaultAdmin().catch((err) => console.error("Admin init failed:", err));
} else {
  mongoose.connection.once('open', () => {
    ensureDefaultAdmin().catch((err) => console.error("Admin init failed:", err));
  });
}

// ==========================================
// ROUTES
// ==========================================

// 1. Initial Setup Route (GET Request so it works instantly in your browser)
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
      message: "Admin Reset Successful! You can now log in to the dashboard.",
      createdUser: username
    });
  } catch (err) {
    console.error("Setup Route Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Login Route
router.post('/login', async (req, res) => {
  // Renamed to avoid conflicts with global username/password variables
  const { username: reqUsername, password: reqPassword } = req.body;

  const admin = await Admin.findOne({ username: reqUsername });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(reqPassword, admin.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: admin._id, role: "admin" }, JWT_SECRET, { expiresIn: "24h" });

  res.json({ success: true, token, username: admin.username });
});

// 3. Update Credentials Route
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

module.exports = router;
