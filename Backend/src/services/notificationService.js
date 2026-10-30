// src/services/notificationService.js
const Notification = require('../models/Notification');
const User = require('../models/User');

const createNotification = async ({ recipientId, recipientRole, type, title, message, link = '' }) => {
  try {
    return await Notification.create({
      recipientId,
      recipientRole,
      type,
      title,
      message,
      link
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

const notifyAdmins = async ({ type, title, message, link = '' }) => {
  try {
    const admins = await User.find({ role: 'ADMIN' });
    const notifications = admins.map((admin) => ({
      recipientId: admin._id,
      recipientRole: 'ADMIN',
      type,
      title,
      message,
      link
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (error) {
    console.error('Error notifying admins:', error);
  }
};

module.exports = {
  createNotification,
  notifyAdmins
};

