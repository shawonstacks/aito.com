// src/routes/productRoutes.js
const express = require('express');
const { createProduct, getAllProducts, getProductById, getVendorProducts } = require('../controllers/productController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public route: সবাই সব প্রোডাক্ট দেখতে পারবে
router.get('/', getAllProducts);

// Vendor routes: ফ্রন্টএন্ডের URL এর সাথে হুবহু মিলিয়ে দেওয়া হলো
router.post('/', authenticate, authorizeRoles('VENDOR'), createProduct);
router.get('/my-products', authenticate, authorizeRoles('VENDOR'), getVendorProducts);

// Product detail route should be last among the GET routes so /my-products keeps working
router.get('/:id', getProductById);

module.exports = router;