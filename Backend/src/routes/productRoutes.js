// src/routes/productRoutes.js
const express = require('express');
const { createProduct, getAllProducts, getVendorProducts } = require('../controllers/productController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public route: সবাই সব প্রোডাক্ট দেখতে পারবে
router.get('/', getAllProducts);

// Vendor routes: শুধু ভেন্ডররাই প্রোডাক্ট অ্যাড বা নিজের প্রোডাক্ট দেখতে পারবে
router.post('/add', authenticate, authorizeRoles('VENDOR'), createProduct);
router.get('/vendor-products', authenticate, authorizeRoles('VENDOR'), getVendorProducts);

module.exports = router;