const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

require('dotenv').config();

const router = express.Router();

// ==========================================
// ENV VARIABLES
// ==========================================

const username = process.env.USER_NAME || "admin";
const password = process.env.PASSWORD || "admin123";

const JWT_SECRET =
  process.env.JWT_SECRET || "fallback_jwt_secret";

const HASHED_SECRET =
  process.env.HASHED_SECRET ||
  "fallback_hashed_secret";

// ==========================================
// JWT VERIFY MIDDLEWARE
// ==========================================

const verifyAdminToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    req.admin = decoded;

    next();
  } catch (err) {
    console.error(
      "JWT Verification Error:",
      err
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// ==========================================
// ADMIN SCHEMA
// ==========================================

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  secretKey: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model(
  'Admin',
  adminSchema
);

// ==========================================
// AUTO CREATE DEFAULT ADMIN
// ==========================================

async function ensureDefaultAdmin() {
  try {
    const adminCount =
      await Admin.countDocuments();

    if (adminCount === 0) {
      const hashedPassword =
        await bcrypt.hash(password, 10);

      const hashedSecret =
        await bcrypt.hash(
          HASHED_SECRET,
          10
        );

      const newAdmin = new Admin({
        username,
        password: hashedPassword,
        secretKey: hashedSecret,
      });

      await newAdmin.save();

      console.log(
        "✅ Default admin created:",
        username
      );
    }
  } catch (err) {
    console.error(
      "❌ Admin init failed:",
      err
    );
  }
}

// ==========================================
// DB CONNECTION CHECK
// ==========================================

if (mongoose.connection.readyState === 1) {
  ensureDefaultAdmin();
} else {
  mongoose.connection.once(
    'open',
    () => {
      ensureDefaultAdmin();
    }
  );
}

// ==========================================
// ROUTES
// ==========================================

// ==========================================
// 1. RESET ADMIN
// ==========================================

router.get('/setup', async (req, res) => {
  try {
    await Admin.deleteMany({});

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const hashedSecret =
      await bcrypt.hash(
        HASHED_SECRET,
        10
      );

    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      secretKey: hashedSecret,
    });

    await newAdmin.save();

    res.json({
      success: true,
      message:
        "Admin Reset Successful!",
      createdUser: username,
    });
  } catch (err) {
    console.error(
      "Setup Route Error:",
      err
    );

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ==========================================
// 2. LOGIN
// ==========================================

router.post('/login', async (req, res) => {
  try {
    const {
      username: reqUsername,
      password: reqPassword,
    } = req.body;

    const admin = await Admin.findOne({
      username: reqUsername,
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch =
      await bcrypt.compare(
        reqPassword,
        admin.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
      },
      JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.json({
      success: true,
      token,
      username: admin.username,
    });
  } catch (err) {
    console.error(
      "Login Error:",
      err
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ==========================================
// 3. VERIFY TOKEN
// ==========================================

router.get(
  '/verify',
  verifyAdminToken,
  async (req, res) => {
    try {
      res.json({
        success: true,
        admin: req.admin,
      });
    } catch (err) {
      console.error(
        "Verify Error:",
        err
      );

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// ==========================================
// 4. UPDATE CREDENTIALS
// ==========================================

router.post(
  '/update-credentials',
  verifyAdminToken,
  async (req, res) => {
    try {
      const {
        currentUsername,
        secretKey,
        newUsername,
        newPassword,
      } = req.body;

      const admin =
        await Admin.findOne({
          username: currentUsername,
        });

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      const isKeyValid =
        await bcrypt.compare(
          secretKey,
          admin.secretKey
        );

      if (!isKeyValid) {
        return res.status(403).json({
          success: false,
          message:
            "Invalid Secret Key",
        });
      }

      if (newUsername) {
        admin.username =
          newUsername;
      }

      if (newPassword) {
        admin.password =
          await bcrypt.hash(
            newPassword,
            10
          );
      }

      await admin.save();

      res.json({
        success: true,
        message:
          "Credentials updated successfully!",
      });
    } catch (err) {
      console.error(
        "Update Credentials Error:",
        err
      );

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

module.exports = {
  router,
  verifyAdminToken,
};