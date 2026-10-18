const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Shop = require('../models/Shop');
const { generateToken } = require('../utils/jwt');

// Register User (Customer or Vendor)
const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, shopName } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email or phone already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine user role safely
    let assignedRole = 'CUSTOMER';
    if (role === 'VENDOR') assignedRole = 'VENDOR';
    if (email === 'admin@aito.com') assignedRole = 'ADMIN';

    const user = await User.create({
      name,
      email,
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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Force ADMIN role for admin@aito.com if it somehow differs in DB
    if (email === 'admin@aito.com' && user.role !== 'ADMIN') {
      user.role = 'ADMIN';
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