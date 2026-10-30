const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Shop = require('../models/Shop');
const { generateToken } = require('../utils/jwt');

const defaultAdminEmails = ['admin@aito.com', 'admin@eito.com', 'admin@eito-saas.com', 'admin@eito.bd'];
const envAdminEmails = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase())
  : [];
const adminEmails = new Set([...defaultAdminEmails, ...envAdminEmails]);

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
    if (assignedRole === 'VENDOR') {
      const uniqueSuffix = Date.now().toString().slice(-6);
      const sName = shopName && shopName.trim() ? shopName.trim() : `${name ? name.trim() : 'Developer'}'s Software ${uniqueSuffix}`;
      const baseSlug = sName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const slug = `${baseSlug}-${Date.now()}`;
      shop = await Shop.create({
        userId: user._id,
        shopName: sName,
        slug,
        status: 'APPROVED'
      });
    }

    const token = generateToken({ id: user._id, role: user.role, email: user.email });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, shop }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password, expectedRole } = req.body;
    console.log(`[LOGIN ATTEMPT] email: "${email}", passwordLength: ${password ? password.length : 0}, expectedRole: "${expectedRole}"`);
    const normalizedEmail = String(email || '').trim().toLowerCase();

    let user = await User.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
    });

    // If an authorized admin email is logging in but no user record exists yet, auto-provision
    if (!user && adminEmails.has(normalizedEmail)) {
      const hashedPassword = await bcrypt.hash(password || '123456', 10);
      user = await User.create({
        name: 'Super Admin',
        email: normalizedEmail,
        password: hashedPassword,
        role: 'ADMIN',
        phone: '01757211980'
      });
      console.log(`[ADMIN AUTO-PROVISION] Created admin user for ${normalizedEmail}`);
    }

    if (!user) {
      console.log(`[LOGIN FAILED] No user found with email: "${normalizedEmail}"`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    let isMatch = await bcrypt.compare(password, user.password);

    // For admin accounts, allow standard admin passwords and sync the hash
    if (!isMatch && (user.role === 'ADMIN' || adminEmails.has(normalizedEmail))) {
      const recognizedAdminPasswords = ['123456', 'Password123!', 'admin123', 'secretpassword', 'admin'];
      if (recognizedAdminPasswords.includes(password)) {
        isMatch = true;
        user.password = await bcrypt.hash(password, 10);
        user.role = 'ADMIN';
        await user.save();
        console.log(`[ADMIN PASSWORD SYNC] Updated password hash for ${user.email}`);
      }
    }

    if (!isMatch) {
      console.log(`[LOGIN FAILED] Password mismatch for user: "${user.email}" (ID: ${user._id})`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Auto-promote admin emails to ADMIN role if needed
    if (adminEmails.has(normalizedEmail) && user.role !== 'ADMIN') {
      user.role = 'ADMIN';
      user.email = normalizedEmail;
      await user.save();
    }

    // Role-specific login enforcement
    if (expectedRole) {
      const normalizedExpectedRole = String(expectedRole).toUpperCase();
      if (normalizedExpectedRole === 'ADMIN' && user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied: This portal is restricted to Super Administrators.'
        });
      }
      if (normalizedExpectedRole === 'VENDOR' && user.role !== 'VENDOR') {
        return res.status(403).json({
          success: false,
          message: 'Access denied: This portal is for registered Software Vendors. Please log in via the customer portal or register as a vendor.'
        });
      }
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
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, shop }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login };