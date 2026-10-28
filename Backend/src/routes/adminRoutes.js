// src/routes/adminRoutes.js
const express = require('express');
const { getPendingShops, updateShopStatus, getAllUsers, getDashboardStats } = require('../controllers/adminController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// এই রাউটগুলোতে শুধুমাত্র 'ADMIN' রোলধারী ইউজাররাই প্রবেশ করতে পারবে
router.get('/stats', authenticate, authorizeRoles('ADMIN'), getDashboardStats);
router.get('/pending-shops', authenticate, authorizeRoles('ADMIN'), getPendingShops);
router.patch('/shop-status/:shopId', authenticate, authorizeRoles('ADMIN'), updateShopStatus);
router.get('/users', authenticate, authorizeRoles('ADMIN'), getAllUsers);

module.exports = router;