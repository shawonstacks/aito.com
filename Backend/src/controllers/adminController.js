// src/controllers/adminController.js
const Shop = require('../models/Shop');
const User = require('../models/User');
const Product = require('../models/Product');

const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, verifiedVendors, salesSummary] = await Promise.all([
      User.countDocuments(),
      Shop.countDocuments({ status: 'APPROVED' }),
      Product.aggregate([
        { $group: { _id: null, totalSales: { $sum: '$price' } } }
      ])
    ]);

    const totalSales = salesSummary[0]?.totalSales || 0;
    const platformCommission = totalSales * 0.2;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalVendors: verifiedVendors,
        totalSales,
        platformCommission
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ১. সমস্ত পেন্ডিং শপ বা ভেন্ডর লিস্ট দেখা (যাদের অ্যাডমিন এখনো অ্যাপ্রুভ করেনি)
const getPendingShops = async (req, res) => {
  try {
    const pendingShops = await Shop.find({ status: 'PENDING' }).populate('userId', 'name email phone');
    res.status(200).json({
      success: true,
      count: pendingShops.length,
      shops: pendingShops
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ২. ভেন্ডরের শপ অ্যাপ্রুভ বা রিজেক্ট করা
const updateShopStatus = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { status } = req.body; // স্ট্যাটাস হতে পারে: APPROVED বা REJECTED

    if (!['APPROVED', 'REJECTED', 'SUSPENDED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    shop.status = status;
    await shop.save();

    res.status(200).json({
      success: true,
      message: `Shop status updated to ${status} successfully`,
      shop
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ৩. প্ল্যাটফর্মের সকল ইউজারের লিস্ট দেখা (অ্যাডমিনের জন্য)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPendingShops, updateShopStatus, getAllUsers, getDashboardStats };