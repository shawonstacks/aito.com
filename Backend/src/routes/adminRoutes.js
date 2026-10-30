// src/routes/adminRoutes.js
const express = require('express');
const { 
  getDashboardStats, 
  getPendingShops, 
  updateShopStatus, 
  getPendingProducts,
  updateProductStatus,
  getAllUsers,
  getAllVendors,
  getVendorDetails
} = require('../controllers/adminController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes require ADMIN role
router.get('/stats', authenticate, authorizeRoles('ADMIN'), getDashboardStats);
router.get('/vendors', authenticate, authorizeRoles('ADMIN'), getAllVendors);
router.get('/vendors/:shopId', authenticate, authorizeRoles('ADMIN'), getVendorDetails);
router.get('/pending-shops', authenticate, authorizeRoles('ADMIN'), getPendingShops);
router.patch('/shop-status/:shopId', authenticate, authorizeRoles('ADMIN'), updateShopStatus);

router.get('/pending-products', authenticate, authorizeRoles('ADMIN'), getPendingProducts);
router.patch('/product-status/:productId', authenticate, authorizeRoles('ADMIN'), updateProductStatus);

router.get('/users', authenticate, authorizeRoles('ADMIN'), getAllUsers);

module.exports = router;
