const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Shop = require('../models/Shop');
const { generateToken } = require('../utils/jwt');

const adminEmails = new Set(['admin@aito.com', 'admin@eito.com', 'admin@eito-saas.com', 'admin@eito.com']);

// Register User (Customer or Vendor)
const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, shopName } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    const existingUser = await User.findOne({
      $or: [{ email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }, { phone }]
    });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email or phone already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine user role safely
    let assignedRole = 'CUSTOMER';
    if (role === 'VENDOR') assignedRole = 'VENDOR';
    if (adminEmails.has(normalizedEmail)) assignedRole = 'ADMIN';

    const user = await User.create({
      name,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      role: assignedRole
    });

    let shop = null;
    if (assignedRole === 'VENDOR' && shopName) {
      const slug = shopName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      shop = await Shop.create({
        userId: user._id,
        shopName,
        slug
      });
    }

    const token = generateToken({ id: user._id, role: user.role, email: user.email });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, shop }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    const user = await User.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
    });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Auto-promote admin emails to ADMIN role if needed
    if (adminEmails.has(normalizedEmail) && user.role !== 'ADMIN') {
      user.role = 'ADMIN';
      user.email = normalizedEmail;
      await user.save();
    }

    let shop = null;
    if (user.role === 'VENDOR') {
      shop = await Shop.findOne({ userId: user._id });
    }

    const token = generateToken({ id: user._id, role: user.role, email: user.email });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, shop }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login };