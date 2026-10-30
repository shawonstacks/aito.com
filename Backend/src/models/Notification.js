// src/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  recipientRole: { 
    type: String, 
    enum: ['CUSTOMER', 'VENDOR', 'ADMIN'], 
    required: true 
  },
  type: {
    type: String,
    enum: [
      'PRODUCT_SUBMITTED', 
      'PRODUCT_APPROVED', 
      'PRODUCT_CHANGES_REQUESTED', 
      'PRODUCT_REJECTED',
      'NEW_ORDER', 
      'ORDER_STATUS_CHANGED', 
      'SHOP_APPROVED'
    ],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String, default: '' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);

