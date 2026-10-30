// src/controllers/adminController.js
const Shop = require('../models/Shop');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { createNotification } = require('../services/notificationService');

// অ্যাডমিন ড্যাশবোর্ড ওভারভিউ স্ট্যাটস
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, verifiedVendors, orderSalesSummary, totalOrders, pendingProductsCount, pendingShopsCount] = await Promise.all([
      User.countDocuments(),
      Shop.countDocuments({ status: 'APPROVED' }),
      Order.aggregate([
        { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } }
      ]),
      Order.countDocuments(),
      Product.countDocuments({ status: 'PENDING_APPROVAL' }),
      Shop.countDocuments({ status: 'PENDING' })
    ]);

    const totalSales = orderSalesSummary[0]?.totalSales || 0;
    const platformCommission = totalSales * 0.2;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalVendors: verifiedVendors,
        totalSales,
        platformCommission,
        totalOrders,
        pendingProductsCount,
        pendingShopsCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ১. সমস্ত পেন্ডিং শপ বা ভেন্ডর অ্যাপ্লিকেশন দেখা
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

// ২. ভেন্ডরের শপ অনুমোদন বা প্রত্যাখান করা
const updateShopStatus = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { status } = req.body; // APPROVED, REJECTED, SUSPENDED

    if (!['APPROVED', 'REJECTED', 'SUSPENDED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid shop status value' });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    shop.status = status;
    await shop.save();

    // ভেন্ডরকে নোটিফিকেশন পাঠানো
    if (shop.userId) {
      await createNotification({
        recipientId: shop.userId,
        recipientRole: 'VENDOR',
        type: 'SHOP_APPROVED',
        title: status === 'APPROVED' ? '🎉 Vendor Shop Approved!' : `Shop Status: ${status}`,
        message: status === 'APPROVED' 
          ? `Your vendor shop '${shop.shopName}' has been approved! You can now upload software.`
          : `Your vendor shop application was ${status.toLowerCase()}.`,
        link: '/vendor/dashboard'
      });
    }

    res.status(200).json({
      success: true,
      message: `Shop status updated to ${status} successfully`,
      shop
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ৩. রিভিউয়ের অপেক্ষায় থাকা সমস্ত সফটওয়্যার প্রোডাক্ট দেখা
const getPendingProducts = async (req, res) => {
  try {
    const pendingProducts = await Product.find({ status: 'PENDING_APPROVAL' })
      .populate('shopId', 'shopName slug userId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingProducts.length,
      products: pendingProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ৪. সফটওয়্যার প্রোডাক্ট অনুমোদন, সংশোধন বা বাতিল করা (Moderation Action)
const updateProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const { status, adminFeedback } = req.body;

    if (!['APPROVED', 'CHANGES_REQUESTED', 'REJECTED', 'SUSPENDED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid product status value' });
    }

    const product = await Product.findById(productId).populate('shopId');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Software product not found' });
    }

    product.status = status;
    if (adminFeedback !== undefined) {
      product.adminFeedback = adminFeedback;
    }
    await product.save();

    // ভেন্ডরকে নির্দিষ্ট ফিডব্যাকসহ নোটিফিকেশন পাঠানো
    if (product.shopId && product.shopId.userId) {
      if (status === 'APPROVED') {
        await createNotification({
          recipientId: product.shopId.userId,
          recipientRole: 'VENDOR',
          type: 'PRODUCT_APPROVED',
          title: '🎉 Software Approved & Published!',
          message: `Your software '${product.title}' has been verified and published to the marketplace.`,
          link: `/products/${product._id}`
        });
      } else if (status === 'CHANGES_REQUESTED') {
        await createNotification({
          recipientId: product.shopId.userId,
          recipientRole: 'VENDOR',
          type: 'PRODUCT_CHANGES_REQUESTED',
          title: '⚠️ Action Required on Software Submission',
          message: `Admin review for '${product.title}': ${adminFeedback || 'Please address feedback and resubmit.'}`,
          link: '/vendor/dashboard'
        });
      } else if (status === 'REJECTED') {
        await createNotification({
          recipientId: product.shopId.userId,
          recipientRole: 'VENDOR',
          type: 'PRODUCT_REJECTED',
          title: '❌ Software Submission Rejected',
          message: `Your software '${product.title}' was rejected: ${adminFeedback || 'Does not meet listing standards.'}`,
          link: '/vendor/dashboard'
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Software status updated to ${status}`,
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ৫. প্ল্যাটফর্মের সকল ইউজারের লিস্ট দেখা
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ৬. সমস্ত ভেন্ডর ও তাদের শপের বিবরণ দেখা (All Vendors with Product Counts)
const getAllVendors = async (req, res) => {
  try {
    const shops = await Shop.find()
      .populate('userId', 'name email phone role createdAt')
      .sort({ createdAt: -1 });

    // প্রতিটি শপের প্রোডাক্ট কাউন্ট যোগ করা
    const vendorsWithStats = await Promise.all(
      shops.map(async (shop) => {
        const [totalProducts, approvedProducts, pendingProducts] = await Promise.all([
          Product.countDocuments({ shopId: shop._id }),
          Product.countDocuments({ shopId: shop._id, status: 'APPROVED' }),
          Product.countDocuments({ shopId: shop._id, status: 'PENDING_APPROVAL' }),
        ]);

        return {
          ...shop.toObject(),
          stats: {
            totalProducts,
            approvedProducts,
            pendingProducts
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      count: vendorsWithStats.length,
      vendors: vendorsWithStats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ৭. নির্দিষ্ট ভেন্ডরের বিস্তারিত তথ্য ও তার সকল প্রোডাক্টের লিস্ট (Vendor Details & Complete Product Catalog)
const getVendorDetails = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId).populate('userId', 'name email phone role createdAt');
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Vendor shop not found' });
    }

    // এই নির্দিষ্ট ভেন্ডরের সমস্ত প্রোডাক্ট আনা
    const products = await Product.find({ shopId: shop._id }).sort({ createdAt: -1 });

    // এই ভেন্ডরের সেলস রিপোর্ট
    const orders = await Order.find({ 'items.shopId': shop._id }).select('totalAmount status createdAt');

    res.status(200).json({
      success: true,
      vendor: {
        ...shop.toObject(),
        productsCount: products.length,
        products,
        ordersCount: orders.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getDashboardStats, 
  getPendingShops, 
  updateShopStatus, 
  getPendingProducts,
  updateProductStatus,
  getAllUsers,
  getAllVendors,
  getVendorDetails
};
