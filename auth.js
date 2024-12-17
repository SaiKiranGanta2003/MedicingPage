const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/User.js');  // Assuming you have a User model

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

require('dotenv').config();
const jwt = require('jsonwebtoken');

// Create token
const createToken = (user) => {
  const payload = { userId: user._id }; // Include user data in the token
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Sign the token
  return token;
}

// Verify token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode the token
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

module.exports = { createToken, verifyToken };


// Middleware to authenticate user and attach user data to request
const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ error: 'Authentication token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);  // Assuming User has a 'userId' field
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();  // Proceed to next middleware or route handler
  } catch (err) {
    return res.status(401).json({ error: 'Invalid authentication token' });
  }
};

// Middleware to check if the user has the right role
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

// Login function to authenticate users and generate a JWT
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',  // Token expiration
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Register function for creating new users
const register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  authenticateUser,
  authorizeRole,
  login,
  register,
};


// const express = require('express');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');
// const router = express.Router();

// Login Route
// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const user = await User.findOne({ username });

//         if (!user || user.password !== password) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//             expiresIn: '1h',
//         });

//         res.json({ token, role: user.role });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// module.exports = router;
