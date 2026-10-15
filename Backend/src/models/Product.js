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
  price: { type: Number, required: true },
  comparePrice: { type: Number, default: 0 }, // ডিসকাউন্ট প্রাইসের জন্য
  stock: { type: Number, required: true, default: 0 },
  images: [{ type: String }], // প্রোডাক্টের ছবির URL গুলোর অ্যারে
  category: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['DRAFT', 'PUBLISHED', 'OUT_OF_STOCK'], 
    default: 'PUBLISHED' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);