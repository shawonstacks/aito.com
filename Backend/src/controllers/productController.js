// src/controllers/productController.js
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const { notifyAdmins } = require('../services/notificationService');

// ১. ভেন্ডর কর্তৃক নতুন সফটওয়্যার প্রোডাক্ট তৈরি (Create Product)
const createProduct = async (req, res) => {
  try {
    const { 
      title, 
      name, 
      description, 
      shortDescription,
      price, 
      comparePrice, 
      category,
      images, 
      image, 
      demoVideo, 
      liveDemoUrl,
      adminDemoUrl,
      technicalInfo,
      features,
      downloadUrl,
      githubRepoUrl,
      documentationUrl
    } = req.body;

    const productTitle = title || name;
    if (!productTitle) {
      return res.status(400).json({ success: false, message: 'Software title is required' });
    }

    // ভেন্ডরের নিজস্ব শপ আছে কি না এবং সেটি অনুমোদিত কি না চেক করা
    let shop = await Shop.findOne({ userId: req.user.id });
    if (!shop) {
      const vendorUser = await Product.model('User').findById(req.user.id);
      const uniqueSuffix = Date.now().toString().slice(-6);
      const generatedShopName = (vendorUser?.name || 'Developer') + ' Software ' + uniqueSuffix;
      const slug = generatedShopName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();
      shop = await Shop.create({
        userId: req.user.id,
        shopName: generatedShopName,
        slug,
        status: 'APPROVED'
      });
    }

    if (shop.status !== 'APPROVED') {
      shop.status = 'APPROVED';
      await shop.save();
    }

    // ইউনিক স্লাগ জেনারেট করা
    const slug = productTitle.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();

    // images অ্যারে অথবা সিঙ্গেল image URL হ্যান্ডেল করা
    const productImages = Array.isArray(images) && images.length > 0 
      ? images 
      : (image ? [image] : []);

    // ফিচারস অ্যারে
    const productFeatures = Array.isArray(features) 
      ? features 
      : (typeof features === 'string' ? features.split(',').map(f => f.trim()).filter(Boolean) : []);

    const product = await Product.create({
      shopId: shop._id,
      title: productTitle,
      slug,
      description,
      shortDescription: shortDescription || '',
      price: Number(price) || 0,
      comparePrice: Number(comparePrice) || 0,
      stock: 9999,
      isDigital: true,
      category: category || 'Web Application',
      images: productImages,
      demoVideo: demoVideo || '',
      liveDemoUrl: liveDemoUrl || '',
      adminDemoUrl: adminDemoUrl || '',
      technicalInfo: {
        framework: technicalInfo?.framework || '',
        language: technicalInfo?.language || '',
        database: technicalInfo?.database || '',
        version: technicalInfo?.version || '1.0.0',
        compatibility: technicalInfo?.compatibility || ''
      },
      features: productFeatures,
      downloadUrl: downloadUrl || '',
      githubRepoUrl: githubRepoUrl || '',
      documentationUrl: documentationUrl || '',
      status: 'PENDING_APPROVAL',
      adminFeedback: ''
    });

    // অ্যাডমিনদের রিভিউয়ের জন্য নোটিফিকেশন পাঠানো
    await notifyAdmins({
      type: 'PRODUCT_SUBMITTED',
      title: 'New Software Submitted for Approval',
      message: `Vendor '${shop.shopName}' uploaded '${product.title}' for marketplace review.`,
      link: '/admin/dashboard'
    });

    res.status(201).json({
      success: true,
      message: 'Software submitted successfully and sent for Admin approval',
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ২. ভেন্ডর কর্তৃক সফটওয়্যার এডিট এবং পুনরায় সাবমিট (Update & Resubmit)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Software product not found' });
    }

    const shop = await Shop.findOne({ userId: req.user.id });
    if (!shop || product.shopId.toString() !== shop._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only edit your own software' });
    }

    const {
      title,
      description,
      shortDescription,
      price,
      comparePrice,
      category,
      images,
      image,
      demoVideo,
      liveDemoUrl,
      adminDemoUrl,
      technicalInfo,
      features,
      downloadUrl,
      githubRepoUrl,
      documentationUrl,
      resubmitForApproval
    } = req.body;

    if (title) product.title = title;
    if (description) product.description = description;
    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    if (price !== undefined) product.price = Number(price);
    if (comparePrice !== undefined) product.comparePrice = Number(comparePrice);
    if (category) product.category = category;
    if (demoVideo !== undefined) product.demoVideo = demoVideo;
    if (liveDemoUrl !== undefined) product.liveDemoUrl = liveDemoUrl;
    if (adminDemoUrl !== undefined) product.adminDemoUrl = adminDemoUrl;
    if (downloadUrl !== undefined) product.downloadUrl = downloadUrl;
    if (githubRepoUrl !== undefined) product.githubRepoUrl = githubRepoUrl;
    if (documentationUrl !== undefined) product.documentationUrl = documentationUrl;

    if (images) {
      product.images = Array.isArray(images) ? images : (image ? [image] : product.images);
    } else if (image) {
      product.images = [image];
    }

    if (technicalInfo) {
      product.technicalInfo = {
        ...product.technicalInfo,
        ...technicalInfo
      };
    }

    if (features) {
      product.features = Array.isArray(features) 
        ? features 
        : (typeof features === 'string' ? features.split(',').map(f => f.trim()).filter(Boolean) : product.features);
    }

    // যদি ভেন্ডর সমস্যার সমাধান করে পুনরায় অ্যাপ্রুভালের জন্য পাঠায়
    if (resubmitForApproval || product.status === 'CHANGES_REQUESTED') {
      product.status = 'PENDING_APPROVAL';
      product.adminFeedback = '';

      await notifyAdmins({
        type: 'PRODUCT_SUBMITTED',
        title: 'Software Revised & Resubmitted',
        message: `Vendor '${shop.shopName}' revised and resubmitted '${product.title}' for review.`,
        link: '/admin/dashboard'
      });
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Software updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ৩. সকল অ্যাপ্রুভড প্রোডাক্ট দেখা (Public API for Customers - Only APPROVED software)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ 
      status: { $in: ['APPROVED', 'PUBLISHED'] } 
    })
      .populate('shopId', 'shopName slug logo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ৪. নির্দিষ্ট প্রোডাক্ট দেখা (Detail Page)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('shopId', 'shopName slug logo');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Software product not found' });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ৫. নির্দিষ্ট ভেন্ডরের নিজের সফটওয়্যারগুলো দেখা (Strictly Isolated to this Vendor's Shop)
const getVendorProducts = async (req, res) => {
  try {
    let shop = await Shop.findOne({ userId: req.user.id });
    if (!shop) {
      const vendorUser = await Product.model('User').findById(req.user.id);
      const uniqueSuffix = Date.now().toString().slice(-6);
      const generatedShopName = (vendorUser?.name || 'Developer') + ' Software ' + uniqueSuffix;
      const slug = generatedShopName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();
      shop = await Shop.create({
        userId: req.user.id,
        shopName: generatedShopName,
        slug,
        status: 'APPROVED'
      });
    }

    // শুধুমাত্র এই ভেন্ডরের shopId এর প্রোডাক্টগুলো আনবে
    const products = await Product.find({ shopId: shop._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ৬. প্রোডাক্ট ডিলিট করা
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.user.role === 'VENDOR') {
      const shop = await Shop.findOne({ userId: req.user.id });
      if (!shop || product.shopId.toString() !== shop._id.toString()) {
        return res.status(403).json({ success: false, message: 'You can only delete your own products' });
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  createProduct, 
  updateProduct,
  getAllProducts, 
  getProductById, 
  getVendorProducts, 
  deleteProduct 
};
