// src/controllers/productController.js
const Product = require('../models/Product');
const Shop = require('../models/Shop');

// ১. ভেন্ডর কর্তৃক নতুন প্রোডাক্ট তৈরি (Create Product)
const createProduct = async (req, res) => {
  try {
    const { title, name, description, price, comparePrice, stock, images, image, category } = req.body;

    // name বা title যেকোনো একটি গ্রহণ করা
    const productTitle = title || name;

    if (!productTitle) {
      return res.status(400).json({ success: false, message: 'Product title or name is required' });
    }

    // ভেন্ডরের নিজস্ব শপ আছে কি না এবং সেটি অনুমোদিত কি না চেক করা
    const shop = await Shop.findOne({ userId: req.user.id });
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop profile not found for this vendor' });
    }

    if (shop.status !== 'APPROVED') {
      return res.status(403).json({ success: false, message: 'Your shop is not approved by admin yet to sell products' });
    }

    // ইউনিক স্লাগ জেনারেট করা (নিরাপদভাবে)
    const slug = productTitle.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();

    // images অ্যারে অথবা সিঙ্গেল image URL হ্যান্ডেল করা
    const productImages = images || (image ? [image] : []);

    const product = await Product.create({
      shopId: shop._id,
      title: productTitle,
      slug,
      description,
      price,
      comparePrice,
      stock,
      images: productImages,
      category
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ২. সকল পাবলিশড প্রোডাক্ট দেখা (Public API for Customers)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: 'PUBLISHED' }).populate('shopId', 'shopName slug logo');
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ৩. নির্দিষ্ট ভেন্ডরের নিজের প্রোডাক্টগুলো দেখা
const getVendorProducts = async (req, res) => {
  try {
    const shop = await Shop.findOne({ userId: req.user.id });
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    const products = await Product.find({ shopId: shop._id });
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createProduct, getAllProducts, getVendorProducts };