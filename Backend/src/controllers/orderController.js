// src/controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const { createNotification, notifyAdmins } = require('../services/notificationService');

// ১. কাস্টমার কর্তৃক নতুন অর্ডার প্লেস করা (Create Order)
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body; // items: [{ productId, quantity }]

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in the order' });
    }

    let orderItems = [];
    let totalAmount = 0;
    const vendorShopIds = new Set();

    // কার্টের প্রতিটি প্রোডাক্ট চেক করে দাম ও শপ আইডি বের করা
    for (let item of items) {
      const pid = item.productId || item.product || item._id;
      const product = await Product.findById(pid);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${pid}` });
      }

      // ডিজিটাল সফটওয়্যার বা ফিজিক্যাল প্রডাক্টের স্টক চেক
      if (!product.isDigital && product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for product: ${product.title}` });
      }

      // স্টক কমানো (যদি স্টক ট্র্যাকিং প্রয়োজন হয়)
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
      }

      orderItems.push({
        productId: product._id,
        shopId: product.shopId,
        title: product.title,
        price: product.price,
        quantity: item.quantity
      });

      vendorShopIds.add(product.shopId.toString());
      totalAmount += product.price * item.quantity;
    }

    // অর্ডার তৈরি করা
    const order = await Order.create({
      customerId: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress
    });

    // নোটিফিকেশন পাঠানো
    // ১. কাস্টমারকে নোটিফিকেশন
    await createNotification({
      recipientId: req.user.id,
      recipientRole: 'CUSTOMER',
      type: 'NEW_ORDER',
      title: 'Order Confirmed! Software License Active',
      message: `Your order #${order._id} for ৳${totalAmount.toLocaleString()} has been placed. You can now access your software license.`,
      link: '/cart'
    });

    // ২. সংশ্লিষ্ট প্রতিটি ভেন্ডরকে নোটিফিকেশন
    for (const shopId of vendorShopIds) {
      const shop = await Shop.findById(shopId);
      if (shop && shop.userId) {
        await createNotification({
          recipientId: shop.userId,
          recipientRole: 'VENDOR',
          type: 'NEW_ORDER',
          title: 'New Software License Purchased!',
          message: `A client placed order #${order._id} for your software products.`,
          link: '/vendor/dashboard'
        });
      }
    }

    // ৩. অ্যাডমিনকে নোটিফিকেশন
    await notifyAdmins({
      type: 'NEW_ORDER',
      title: 'New Marketplace Order Placed',
      message: `Order #${order._id} placed for total ৳${totalAmount.toLocaleString()}.`,
      link: '/admin/dashboard'
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
    const orders = await Order.find({ customerId: req.user.id })
      .populate('items.productId', 'title slug images demoVideo category')
      .populate('items.shopId', 'shopName slug')
      .sort({ createdAt: -1 });
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
    const orders = await Order.find({ 'items.shopId': shop._id })
      .populate('customerId', 'name email phone')
      .sort({ createdAt: -1 });

    let totalEarnings = 0;

    // ভেন্ডরের সুবিধার জন্য অর্ডার থেকে শুধু তার শপের আইটেমগুলো হাইলাইট করা
    const vendorOrders = orders.map((order) => {
      const filteredItems = order.items.filter(
        (item) => item.shopId.toString() === shop._id.toString()
      );
      
      const orderRevenue = filteredItems.reduce(
        (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
        0
      );
      totalEarnings += orderRevenue;

      return {
        orderId: order._id,
        customer: order.customerId,
        shippingAddress: order.shippingAddress,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
        items: filteredItems,
        orderRevenue
      };
    });

    res.status(200).json({
      success: true,
      count: vendorOrders.length,
      totalEarnings,
      orders: vendorOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getCustomerOrders, getVendorOrders };