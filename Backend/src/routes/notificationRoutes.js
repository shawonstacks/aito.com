// src/routes/notificationRoutes.js
const express = require('express');
const { 
  getMyNotifications, 
  markAsRead, 
  markAllAsRead 
} = require('../controllers/notificationController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticate, getMyNotifications);
router.patch('/read-all', authenticate, markAllAsRead);
router.patch('/:id/read', authenticate, markAsRead);

module.exports = router;

