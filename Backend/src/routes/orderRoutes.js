// src/routes/orderRoutes.js
const express = require('express');
const { createOrder, getCustomerOrders, getVendorOrders } = require('../controllers/orderController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// কাস্টমার রাউট
router.post('/', authenticate, authorizeRoles('CUSTOMER'), createOrder);
router.post('/create', authenticate, authorizeRoles('CUSTOMER'), createOrder);
router.get('/my-orders', authenticate, authorizeRoles('CUSTOMER'), getCustomerOrders);

// ভেন্ডর রাউট
router.get('/vendor-orders', authenticate, authorizeRoles('VENDOR'), getVendorOrders);

module.exports = router;