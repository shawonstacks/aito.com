const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  shopName: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  logo: { type: String, default: '' },
  banner: { type: String, default: '' },
  description: { type: String, default: '' },
  commissionRate: { type: Number, default: 5.0 },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED'], 
    default: 'PENDING' 
  },
  bankAccount: { type: String, default: '' },
  mobilePayment: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);