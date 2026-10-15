// src/controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const Shop = require('../models/Shop');

// ১. কাস্টমার কর্তৃক নতুন অর্ডার প্লেস করা (Create Order)
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body; // items: [{ productId, quantity }]

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in the order' });
    }

    let orderItems = [];
    let totalAmount = 0;

    // কার্টের প্রতিটি প্রোডাক্ট চেক করে দাম ও শপ আইডি বের করা
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for product: ${product.title}` });
      }

      // স্টক কমানো
      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        productId: product._id,
        shopId: product.shopId,
        title: product.title,
        price: product.price,
        quantity: item.quantity
      });

      totalAmount += product.price * item.quantity;
    }

    // অর্ডার তৈরি করা
    const order = await Order.create({
      customerId: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ২. কাস্টমারের নিজের অর্ডার হিস্ট্রি দেখা
const getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ৩. ভেন্ডর তার নিজের শপের প্রোডাক্টগুলোর অর্ডার দেখা
const getVendorOrders = async (req, res) => {
  try {
    const shop = await Shop.findOne({ userId: req.user.id });
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    // যে অর্ডারের আইটেমগুলোতে এই ভেন্ডরের shopId আছে সেগুলো ফিল্টার করা
    const orders = await Order.find({ 'items.shopId': shop._id }).sort({ createdAt: -1 });

    // ভেন্ডরের সুবিধার জন্য অর্ডার থেকে শুধু তার শপের আইটেমগুলো হাইলাইট করা যেতে পারে
    const vendorOrders = orders.map(order => {
      const filteredItems = order.items.filter(item => item.shopId.toString() === shop._id.toString());
      return {
        orderId: order._id,
        customer: order.customerId,
        shippingAddress: order.shippingAddress,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
        items: filteredItems
      };
    });

    res.status(200).json({
      success: true,
      count: vendorOrders.length,
      orders: vendorOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getCustomerOrders, getVendorOrders };