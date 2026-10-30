// src/routes/productRoutes.js
const express = require('express');
const { 
  createProduct, 
  updateProduct,
  getAllProducts, 
  getProductById, 
  getVendorProducts, 
  deleteProduct 
} = require('../controllers/productController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public route: শুধুমাত্র APPROVED সফটওয়্যার প্রোডাক্টগুলো দেখতে পারবে
router.get('/', getAllProducts);

// Vendor routes:
router.post('/', authenticate, authorizeRoles('VENDOR'), createProduct);
router.get('/my-products', authenticate, authorizeRoles('VENDOR'), getVendorProducts);
router.get('/vendor', authenticate, authorizeRoles('VENDOR'), getVendorProducts);
router.put('/:id', authenticate, authorizeRoles('VENDOR'), updateProduct);
router.delete('/:id', authenticate, authorizeRoles('ADMIN', 'VENDOR'), deleteProduct);

// Product detail route:
router.get('/:id', getProductById);

module.exports = router;
