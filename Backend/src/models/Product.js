// src/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  shopId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Shop', 
    required: true 
  },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  price: { type: Number, required: true },
  comparePrice: { type: Number, default: 0 },
  stock: { type: Number, default: 9999 },
  isDigital: { type: Boolean, default: true },
  category: { type: String, required: true },
  
  // Media & Previews
  images: [{ type: String }], // Screenshots and preview images
  demoVideo: { type: String, default: '' }, // YouTube, Vimeo, or MP4 URL
  liveDemoUrl: { type: String, default: '' }, // Public live preview link
  adminDemoUrl: { type: String, default: '' }, // Optional admin preview credentials

  // Technical Specifications
  technicalInfo: {
    framework: { type: String, default: '' },
    language: { type: String, default: '' },
    database: { type: String, default: '' },
    version: { type: String, default: '1.0.0' },
    compatibility: { type: String, default: '' }
  },

  // Key Features
  features: [{ type: String }],

  // Digital Delivery Assets
  downloadUrl: { type: String, default: '' },
  githubRepoUrl: { type: String, default: '' },
  documentationUrl: { type: String, default: '' },

  // Moderation & Approval Lifecycle
  status: { 
    type: String, 
    enum: ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED', 'SUSPENDED'], 
    default: 'PENDING_APPROVAL' 
  },
  adminFeedback: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
